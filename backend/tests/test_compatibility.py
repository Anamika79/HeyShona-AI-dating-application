import json
from unittest.mock import MagicMock, patch
import pytest
from fastapi.testclient import TestClient
from app.core.dummy_data import DUMMY_PROFILES
from app.services.compatibility_engine import calculate_deterministic_breakdown


def test_deterministic_compatibility_calculation():
    """Verify weighted dimension scoring produces consistent scores between 0 and 100."""
    user_a = DUMMY_PROFILES[0]  # Tara (Biologist)
    user_b = DUMMY_PROFILES[1]  # Rohan (Designer)

    score, breakdown = calculate_deterministic_breakdown(
        user_a.profile_data, user_b.profile_data
    )

    assert 40 <= score <= 100
    assert 0 <= breakdown.core_values.score <= 100
    assert 0 <= breakdown.relationship_expectations.score <= 100
    assert 0 <= breakdown.communication_style.score <= 100
    assert 0 <= breakdown.lifestyle_and_interests.score <= 100
    assert 0 <= breakdown.personal_boundaries.score <= 100

    # Ensure weights match formula
    assert breakdown.core_values.weight == 0.30
    assert breakdown.relationship_expectations.weight == 0.25
    assert breakdown.communication_style.weight == 0.20
    assert breakdown.lifestyle_and_interests.weight == 0.15
    assert breakdown.personal_boundaries.weight == 0.10


def test_get_candidates_discovery_endpoint(client: TestClient):
    """Verify /api/v1/compatibility/candidates returns list of scored candidate cards."""
    response = client.get("/api/v1/compatibility/candidates")
    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 7
    # Verify card structure
    first_card = data[0]
    assert "profile" in first_card
    assert "compatibility_score" in first_card
    assert "compatibility_headline" in first_card

    # Verify score variation
    scores = [c["compatibility_score"] for c in data]
    assert len(set(scores)) > 1  # Not all the same score
    assert max(scores) <= 100
    assert min(scores) >= 40


def test_compare_profiles_endpoint(client: TestClient):
    """Verify /api/v1/compatibility/compare generates a full report with breakdown & AI insights."""
    mock_payload = {
        "headline": "Complementary passion for exploration and mindful dialogue.",
        "overall_explanation": "Both individuals value intentional living and transparent conversations.",
        "why_you_might_connect": [
            "Shared dedication to authenticity and personal growth.",
            "Complementary curiosity toward nature and creativity."
        ],
        "potential_differences": [
            "Different pacing in daily schedules may require periodic check-ins."
        ],
        "conversation_starters": [
            "What was your most immersive creative project recently?",
            "How do you like spending quiet Sunday mornings?"
        ]
    }

    mock_candidate = MagicMock()
    mock_candidate.content.parts = [MagicMock(text=json.dumps(mock_payload))]
    mock_response = MagicMock(text=json.dumps(mock_payload), candidates=[mock_candidate])

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        payload = {
            "user_a_profile": DUMMY_PROFILES[0].model_dump(),
            "user_b_profile": DUMMY_PROFILES[1].model_dump(),
        }

        response = client.post("/api/v1/compatibility/compare", json=payload)
        assert response.status_code == 200
        report = response.json()

        assert "overall_score" in report
        assert "breakdown" in report
        assert "why_you_might_connect" in report
        assert len(report["why_you_might_connect"]) >= 2
        assert "potential_differences" in report
        assert len(report["potential_differences"]) >= 1
        assert "conversation_starters" in report
        assert len(report["conversation_starters"]) >= 2
