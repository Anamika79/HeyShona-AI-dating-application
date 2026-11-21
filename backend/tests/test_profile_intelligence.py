import json
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient

from app.schemas.profile_intelligence import ProfileIntelligenceResponse
from app.services.gemini_service import (
    GeminiConfigurationError,
    GeminiResponseParsingError,
    GeminiService,
    GeminiServiceError,
    gemini_service,
)

# Standard valid inner mock JSON
MOCK_INNER_DATA = {
    "personality_insights": [
        {
            "trait": "Curious and tech-enthusiast",
            "evidence": "I enjoy technology and football",
            "confidence": "explicit",
        }
    ],
    "core_values": [
        {
            "value": "Honesty and Authenticity",
            "evidence": "I value honesty and meaningful conversations",
            "is_explicit": True,
        }
    ],
    "interests_and_lifestyle": [
        {
            "interest": "Travelling",
            "category": "lifestyle",
            "evidence": "I enjoy travelling",
        },
        {
            "interest": "Football",
            "category": "sports",
            "evidence": "and football",
        },
    ],
    "relationship_expectations": [
        {
            "expectation": "Meaningful and authentic connection",
            "evidence": "meaningful conversations",
        }
    ],
    "communication_preferences": [
        {
            "preference": "Deep, meaningful conversations over small talk",
            "evidence": "meaningful conversations",
        }
    ],
    "personal_boundaries": [],
    "missing_information": {
        "unknown_aspects": ["Specific relationship goals (e.g. casual vs. long-term)"],
        "recommended_follow_up_questions": [
            "What kind of travel destinations inspire you the most?"
        ],
    },
}

MOCK_OUTER_JSON = json.dumps({"response": json.dumps(MOCK_INNER_DATA)})


@pytest.fixture(autouse=True)
def setup_mock_api_key():
    """Ensure a dummy API key is configured on the service for mock tests."""
    original_key = gemini_service.api_key
    gemini_service.api_key = "test-api-key-for-unit-tests"
    yield
    gemini_service.api_key = original_key


def test_analyze_profile_success(client: TestClient):
    """
    Test 1: Successful profile analysis using mocked Gemini API response.
    Verifies that the nested outer JSON is properly unpacked and validated.
    """
    mock_candidate = MagicMock()
    mock_candidate.content.parts = [MagicMock(text=MOCK_OUTER_JSON)]
    mock_response = MagicMock(text=MOCK_OUTER_JSON, candidates=[mock_candidate])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={
                "profile_text": "I enjoy travelling, technology and football. I value honesty and meaningful conversations."
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "response" in data

        profile_data = data["response"]
        assert len(profile_data["personality_insights"]) == 1
        assert profile_data["personality_insights"][0]["trait"] == "Curious and tech-enthusiast"
        assert profile_data["personality_insights"][0]["evidence"] == "I enjoy technology and football"

        assert len(profile_data["core_values"]) == 1
        assert profile_data["core_values"][0]["value"] == "Honesty and Authenticity"

        assert len(profile_data["interests_and_lifestyle"]) == 2
        assert len(profile_data["communication_preferences"]) == 1
        assert len(profile_data["personal_boundaries"]) == 0
        assert len(profile_data["missing_information"]["recommended_follow_up_questions"]) == 1


def test_analyze_profile_empty_submission(client: TestClient):
    """
    Test 2: Empty profile submission.
    Verifies that empty string or whitespace-only profile text triggers 422 Unprocessable Entity.
    """
    # Empty string
    response = client.post(
        "/api/v1/profile-intelligence/analyze",
        json={"profile_text": ""},
    )
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

    # Whitespace only
    response_spaces = client.post(
        "/api/v1/profile-intelligence/analyze",
        json={"profile_text": "   \n\t  "},
    )
    assert response_spaces.status_code == 422
    data_spaces = response_spaces.json()
    assert data_spaces["error"]["code"] == "VALIDATION_ERROR"


def test_analyze_profile_invalid_gemini_json(client: TestClient):
    """
    Test 3: Invalid Gemini JSON.
    Verifies that malformed outer JSON or invalid inner JSON string returns 502 Bad Gateway.
    """
    # Case 3a: Completely malformed outer JSON
    mock_response_bad_outer = MagicMock(text="THIS_IS_NOT_JSON", candidates=[])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response_bad_outer
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={"profile_text": "Valid profile text here."},
        )
        assert response.status_code == 502
        data = response.json()
        assert "error" in data
        assert "unparseable or invalid response" in data["error"]["message"]

    # Case 3b: Valid outer JSON but malformed inner JSON string
    bad_inner_json = json.dumps({"response": "{ broken json inner ..."})
    mock_response_bad_inner = MagicMock(text=bad_inner_json, candidates=[])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response_bad_inner
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={"profile_text": "Valid profile text here."},
        )
        assert response.status_code == 502
        data = response.json()
        assert "error" in data
        assert "unparseable or invalid response" in data["error"]["message"]


def test_analyze_profile_missing_response_field(client: TestClient):
    """
    Test 4: Missing outer 'response' field.
    Verifies that when Gemini returns JSON missing the expected outer 'response' key, a 502 is returned.
    """
    missing_response_json = json.dumps({"incorrect_key": "some value"})
    mock_response = MagicMock(text=missing_response_json, candidates=[])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={"profile_text": "Valid profile text here."},
        )
        assert response.status_code == 502
        data = response.json()
        assert "missing required 'response' field" in data["error"]["message"]


def test_analyze_profile_gemini_api_failure(client: TestClient):
    """
    Test 5: Gemini API failure.
    Verifies that API connection/service exceptions return 502 Bad Gateway.
    """
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = RuntimeError("Google API network connection refused")
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={"profile_text": "Valid profile text here."},
        )
        assert response.status_code == 502
        data = response.json()
        assert "AI service communication failure" in data["error"]["message"]


def test_analyze_profile_pydantic_validation_failure(client: TestClient):
    """
    Test 6: Pydantic validation failure.
    Verifies that if Gemini returns inner JSON with missing required fields or invalid types,
    it raises a parsing/validation error handled as 502.
    """
    # Missing required field 'trait' in personality_insights
    invalid_schema_inner = {
        "personality_insights": [{"evidence": "no trait field provided"}],
        "core_values": [],
        "interests_and_lifestyle": [],
        "relationship_expectations": [],
        "communication_preferences": [],
        "personal_boundaries": [],
        "missing_information": {"unknown_aspects": [], "recommended_follow_up_questions": []},
    }
    invalid_schema_outer = json.dumps({"response": json.dumps(invalid_schema_inner)})
    mock_response = MagicMock(text=invalid_schema_outer, candidates=[])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        response = client.post(
            "/api/v1/profile-intelligence/analyze",
            json={"profile_text": "Valid profile text here."},
        )
        assert response.status_code == 502
        data = response.json()
        assert "schema validation failed" in data["error"]["message"]


def test_analyze_profile_missing_api_configuration(client: TestClient):
    """
    Test 7: Missing Gemini API configuration.
    Verifies that if GEMINI_API_KEY is not configured or empty, a 500 error is returned.
    """
    # Explicitly set API key to empty string
    gemini_service.api_key = ""

    response = client.post(
        "/api/v1/profile-intelligence/analyze",
        json={"profile_text": "Valid profile text here."},
    )
    assert response.status_code == 500
    data = response.json()
    assert "AI service configuration error" in data["error"]["message"]


def test_gemini_service_unit_parser():
    """Unit test for GeminiService.parse_gemini_response parser logic in isolation."""
    service = GeminiService(api_key="test-key")

    # Handles markdown wrapping
    wrapped_json = f"```json\n{MOCK_OUTER_JSON}\n```"
    result = service.parse_gemini_response(wrapped_json)
    assert isinstance(result, ProfileIntelligenceResponse)
    assert len(result.response.personality_insights) == 1
    assert result.response.personality_insights[0].trait == "Curious and tech-enthusiast"

    # Handles empty input
    with pytest.raises(GeminiResponseParsingError, match="Empty response"):
        service.parse_gemini_response("")
