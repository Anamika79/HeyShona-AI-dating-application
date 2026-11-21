from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dummy_data import DUMMY_PROFILES
from app.core.logging import logger
from app.schemas.compatibility import (
    CandidateCompatibilityCard,
    CompatibilityAnalysisRequest,
    CompatibilityReport,
    UserProfileSummary,
)
from app.schemas.error import StandardErrorResponse
from app.services.compatibility_engine import calculate_deterministic_breakdown
from app.services.compatibility_service import (
    CompatibilityService,
    compatibility_service,
)

router = APIRouter()


def get_compatibility_service() -> CompatibilityService:
    return compatibility_service


@router.get(
    "/candidates",
    response_model=List[CandidateCompatibilityCard],
    summary="Get candidate discovery cards with calculated compatibility",
)
def get_candidate_profiles(
    current_user_id: str = "current_user",
    looking_for: Optional[str] = None,
) -> List[CandidateCompatibilityCard]:
    """
    Returns discovery candidate profiles with calculated compatibility against the reference user.
    Optionally filters by the user's anonymous 'looking_for' preference (e.g. 'Female', 'Male', 'LGBTQ+', 'Everyone').
    """
    reference_user = DUMMY_PROFILES[0]

    # Filter candidates based on anonymous looking_for preference
    candidates = DUMMY_PROFILES[1:]
    if looking_for and looking_for.strip().lower() not in ["everyone", "all", ""]:
        target = looking_for.strip().lower()
        if target in ["gay", "queer", "lesbian", "lgbtq", "lgbtq+"]:
            filtered = [c for c in candidates if (c.gender or "").lower() == "lgbtq+"]
        else:
            filtered = [c for c in candidates if (c.gender or "").lower() == target]

        if filtered:
            candidates = filtered

    cards: List[CandidateCompatibilityCard] = []
    for candidate in candidates:
        score, _ = calculate_deterministic_breakdown(
            reference_user.profile_data, candidate.profile_data
        )

        if score >= 85:
            headline = "Exceptionally high alignment on core values & life vision."
        elif score >= 75:
            headline = "Strong shared values with complementary communication habits."
        elif score >= 65:
            headline = "Balanced synergy with intriguing differences to explore."
        else:
            headline = "Distinct life rhythms offering fresh perspectives."

        cards.append(
            CandidateCompatibilityCard(
                profile=candidate,
                compatibility_score=score,
                compatibility_headline=headline,
            )
        )

    # Sort candidates by compatibility score descending
    cards.sort(key=lambda c: c.compatibility_score, reverse=True)
    return cards


@router.post(
    "/compare",
    response_model=CompatibilityReport,
    summary="Calculate comprehensive compatibility report between two profiles",
    responses={
        200: {"description": "Full compatibility report successfully generated."},
        400: {"model": StandardErrorResponse},
        500: {"model": StandardErrorResponse},
    },
)
def compare_profiles(
    payload: CompatibilityAnalysisRequest,
    service: CompatibilityService = Depends(get_compatibility_service),
) -> CompatibilityReport:
    """
    Compares two user profiles using weighted deterministic scoring across 5 dimensions
    and returns Gemini AI-generated qualitative explanations and conversation starters.
    """
    try:
        report = service.analyze_compatibility(
            payload.user_a_profile, payload.user_b_profile
        )
        return report
    except Exception as exc:
        logger.error(f"Error computing profile compatibility: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Compatibility engine failure: {str(exc)}",
        )
