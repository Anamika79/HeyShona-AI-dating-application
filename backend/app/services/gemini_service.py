import json
import logging
from pathlib import Path
from typing import Any, Dict, Optional

from google import genai
from google.genai import types
from google.genai.errors import APIError

from app.core.config import settings
from app.core.logging import logger
from app.schemas.profile_intelligence import ProfileIntelligenceData, ProfileIntelligenceResponse

# Standard prompt path relative to project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
PROMPT_PATH = BASE_DIR / "prompts" / "profile_intelligence_v1.md"


class GeminiConfigurationError(Exception):
    """Raised when Gemini client configuration or required API key is missing."""
    pass


class GeminiServiceError(Exception):
    """Raised when an error occurs during Gemini API generation or communication."""
    pass


class GeminiResponseParsingError(Exception):
    """Raised when the Gemini response cannot be parsed or validated."""
    pass


class GeminiService:
    """Service to interact with the Google Gemini API for Profile Intelligence analysis."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: Optional[int] = None,
        prompt_path: Optional[Path] = None,
    ):
        self.api_key = api_key if api_key is not None else settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.timeout_seconds = timeout_seconds or settings.GEMINI_TIMEOUT_SECONDS
        self.prompt_path = prompt_path or PROMPT_PATH
        self._system_prompt: Optional[str] = None

    def _get_client(self) -> genai.Client:
        """Initialize and return the official google-genai Client."""
        if not self.api_key or not self.api_key.strip():
            logger.error("Gemini API key is missing or not configured.")
            raise GeminiConfigurationError("GEMINI_API_KEY is not configured.")

        # In google-genai SDK, types.HttpOptions expects timeout in milliseconds (e.g. 60000ms for 60s).
        # Passing 60 was interpreted as 0.06 seconds (60 milliseconds), causing TLS handshake timeouts!
        timeout_sec = self.timeout_seconds or settings.GEMINI_TIMEOUT_SECONDS or 60
        timeout_ms = int(timeout_sec * 1000)

        http_options = types.HttpOptions(timeout=timeout_ms)
        return genai.Client(api_key=self.api_key, http_options=http_options)

    def load_system_prompt(self) -> str:
        """Load and cache the Profile Intelligence prompt markdown."""
        if self._system_prompt is None:
            # Check multiple candidate paths
            candidates = [
                self.prompt_path,
                BASE_DIR / "prompts" / "profile_intelligence_v1.md",
                Path(__file__).resolve().parent.parent.parent / "prompts" / "profile_intelligence_v1.md",
                Path("/app/prompts/profile_intelligence_v1.md"),
                Path("/app/backend/prompts/profile_intelligence_v1.md"),
            ]
            for candidate in candidates:
                if candidate and candidate.exists():
                    self._system_prompt = candidate.read_text(encoding="utf-8")
                    logger.info(f"Loaded prompt from {candidate}")
                    return self._system_prompt

            logger.warning("Prompt markdown file not found on disk. Using built-in default prompt.")
            self._system_prompt = (
                "# Profile Intelligence Analysis Prompt (v1)\n\n"
                "## Role & Mission\n"
                "You are the AI Profile Intelligence Analyzer for a high-trust, compatibility-focused dating and networking platform.\n"
                "Your purpose is to objectively analyze user-submitted profile text to extract genuine dimensions of personality, values, interests, expectations, communication patterns, and boundaries to empower meaningful connections.\n\n"
                "## Core Operational Rules & Guardrails\n"
                "1. Grounded In Evidence: Only extract information explicitly provided or directly evident.\n"
                "2. Explicit Facts vs. Cautious Interpretations: Clearly distinguish between explicit facts and cautious interpretations.\n"
                "3. No Sensitive Inferences: Never infer sensitive characteristics.\n"
                "4. No Psychological Diagnosis: Never diagnose mental conditions or attachment disorders.\n"
                "5. Respect Boundaries: Respect personal agency.\n"
                "6. Graceful Handling: Return [] for sparse data.\n\n"
                "## Output Format Requirement\n"
                "You must output a single JSON object with a single key 'response' containing a serialized JSON string:\n"
                "{\"response\": \"{\\\"personality_insights\\\": [], \\\"core_values\\\": [], \\\"interests_and_lifestyle\\\": [], \\\"relationship_expectations\\\": [], \\\"communication_preferences\\\": [], \\\"personal_boundaries\\\": [], \\\"missing_information\\\": {\\\"unknown_aspects\\\": [], \\\"recommended_follow_up_questions\\\": []}}\"}\n"
            )
        return self._system_prompt

    def _extract_and_clean_text(self, raw_text: str) -> str:
        """Strip markdown code fence wrappers if present."""
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip().startswith("```"):
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
        return cleaned

    def parse_gemini_response(self, raw_content: str) -> ProfileIntelligenceResponse:
        """
        Parse and validate Gemini's nested response format:
        Outer JSON: {"response": "<inner JSON string>"}
        Inner JSON: ProfileIntelligenceData fields
        
        Handles:
        1. Outer JSON parsing
        2. Missing outer 'response' key
        3. Extraction of inner string (or inner dict if already parsed)
        4. Inner JSON parsing
        5. Pydantic validation into ProfileIntelligenceResponse
        """
        if not raw_content or not raw_content.strip():
            logger.error("Received empty response content from Gemini.")
            raise GeminiResponseParsingError("Empty response received from Gemini.")

        cleaned_content = self._extract_and_clean_text(raw_content)

        # 1. Parse outer JSON
        try:
            outer_data = json.loads(cleaned_content)
        except json.JSONDecodeError as exc:
            logger.error(f"Failed to parse outer JSON response from Gemini: {exc.msg}")
            raise GeminiResponseParsingError(f"Malformed outer JSON response: {exc.msg}") from exc

        if not isinstance(outer_data, dict):
            logger.error("Outer Gemini response is not a valid JSON object.")
            raise GeminiResponseParsingError("Outer Gemini response must be a JSON object.")

        # 2. Extract 'response' field
        if "response" not in outer_data:
            logger.error("Gemini response is missing the required 'response' field.")
            raise GeminiResponseParsingError("Gemini response is missing required 'response' field.")

        inner_raw = outer_data["response"]

        # 3. Parse inner JSON string if necessary
        if isinstance(inner_raw, str):
            try:
                cleaned_inner = self._extract_and_clean_text(inner_raw)
                inner_data = json.loads(cleaned_inner)
            except json.JSONDecodeError as exc:
                logger.error(f"Failed to parse inner JSON string from Gemini: {exc.msg}")
                raise GeminiResponseParsingError(f"Malformed inner JSON string: {exc.msg}") from exc
        elif isinstance(inner_raw, dict):
            # Already a dict (some parsers/mocks might provide it pre-parsed)
            inner_data = inner_raw
        else:
            logger.error(f"Expected inner 'response' to be a JSON string or object, got {type(inner_raw).__name__}")
            raise GeminiResponseParsingError("Inner 'response' field must be a valid JSON string.")

        if not isinstance(inner_data, dict):
            logger.error("Inner profile intelligence data is not a JSON dictionary.")
            raise GeminiResponseParsingError("Inner profile intelligence content must be an object.")

        # 4. Validate through Pydantic
        try:
            validated_data = ProfileIntelligenceData(**inner_data)
            return ProfileIntelligenceResponse(response=validated_data)
        except Exception as exc:
            logger.error(f"Pydantic validation failed for inner profile intelligence data: {exc}")
            raise GeminiResponseParsingError(f"Profile intelligence schema validation failed: {exc}") from exc

    def analyze_profile(self, profile_text: str) -> ProfileIntelligenceResponse:
        """
        Submit user profile text to Gemini and return validated ProfileIntelligenceResponse.
        
        Guarantees:
        - Never logs private profile text or API keys.
        - Enforces timeouts.
        - Validates all extracted dimensions.
        """
        if not profile_text or not profile_text.strip():
            raise ValueError("Profile text cannot be empty or blank.")

        system_instruction = self.load_system_prompt()
        client = self._get_client()

        user_prompt = (
            "Analyze the following user profile text and output the profile intelligence analysis "
            "strictly adhering to the instructions and JSON output structure defined:\n\n"
            f"--- USER PROFILE ---\n{profile_text.strip()}\n--- END PROFILE ---"
        )

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            temperature=0.2,  # Low temperature for deterministic, factual adherence
        )

        logger.info(
            f"Dispatching profile intelligence analysis request to Gemini model '{self.model}' "
            f"(profile length: {len(profile_text)} chars)."
        )

        try:
            response = client.models.generate_content(
                model=self.model,
                contents=user_prompt,
                config=config,
            )
        except APIError as exc:
            logger.error(f"Gemini API returned error: {exc}")
            raise GeminiServiceError(f"Gemini API error: {exc.message if hasattr(exc, 'message') else str(exc)}") from exc
        except Exception as exc:
            logger.error(f"Unexpected error communicating with Gemini API: {exc}")
            raise GeminiServiceError(f"Failed to communicate with Gemini API: {str(exc)}") from exc

        # Extract generated content text
        raw_text = getattr(response, "text", None)
        if raw_text is None and hasattr(response, "candidates") and response.candidates:
            first_candidate = response.candidates[0]
            if first_candidate.content and first_candidate.content.parts:
                raw_text = first_candidate.content.parts[0].text

        if not raw_text or not raw_text.strip():
            logger.error("Gemini returned an empty candidate text.")
            raise GeminiServiceError("Gemini returned an empty response.")

        # Parse and validate the response
        return self.parse_gemini_response(raw_text)


# Singleton or dependency instance
gemini_service = GeminiService()
