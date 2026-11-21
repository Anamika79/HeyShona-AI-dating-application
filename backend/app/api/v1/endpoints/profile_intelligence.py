from fastapi import APIRouter, Depends, HTTPException, status

from app.core.logging import logger
from app.schemas.error import StandardErrorResponse
from app.schemas.profile_intelligence import (
    ProfileAnalysisRequest,
    ProfileIntelligenceResponse,
)
from app.services.gemini_service import (
    GeminiConfigurationError,
    GeminiResponseParsingError,
    GeminiService,
    GeminiServiceError,
    gemini_service,
)

router = APIRouter()


def get_gemini_service() -> GeminiService:
    """Dependency provider for GeminiService."""
    return gemini_service


@router.post(
    "/analyze",
    response_model=ProfileIntelligenceResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze user profile text using AI Profile Intelligence",
    description=(
        "Analyzes raw user-submitted profile description text using Google Gemini AI "
        "to extract structured personality insights, core values, interests & lifestyle, "
        "relationship expectations, communication preferences, personal boundaries, and missing information."
    ),
    responses={
        200: {
            "description": "Profile intelligence successfully extracted and validated.",
            "model": ProfileIntelligenceResponse,
        },
        400: {
            "description": "Invalid input provided.",
            "model": StandardErrorResponse,
        },
        422: {
            "description": "Validation error on submitted profile text.",
            "model": StandardErrorResponse,
        },
        500: {
            "description": "Server or Gemini configuration error.",
            "model": StandardErrorResponse,
        },
        502: {
            "description": "Gemini AI API failure or malformed model response.",
            "model": StandardErrorResponse,
        },
    },
)
async def analyze_profile(
    payload: ProfileAnalysisRequest,
    service: GeminiService = Depends(get_gemini_service),
) -> ProfileIntelligenceResponse:
    """Analyze profile text and return structured, evidence-grounded intelligence."""
    try:
        result = service.analyze_profile(payload.profile_text)
        return result
    except GeminiConfigurationError as exc:
        logger.error(f"Gemini configuration error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service configuration error: {str(exc)}",
        )
    except GeminiResponseParsingError as exc:
        logger.error(f"Gemini response parsing error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI model returned an unparseable or invalid response: {str(exc)}",
        )
    except GeminiServiceError as exc:
        logger.error(f"Gemini service communication error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI service communication failure: {str(exc)}",
        )
    except ValueError as exc:
        logger.warning(f"Invalid profile input value: {exc}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        logger.error(f"Unexpected error during profile intelligence analysis: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while analyzing the profile.",
        )
