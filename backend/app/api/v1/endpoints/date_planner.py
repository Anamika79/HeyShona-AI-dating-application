from typing import Optional
from fastapi import APIRouter, HTTPException, status

from app.core.logging import logger
from app.schemas.date_planner import (
    DatePreferenceProfile,
    DatePlanningRequest,
    DatePlanResponse,
)
from app.services.date_planner_service import date_planner_service

router = APIRouter()


@router.get(
    "/preferences/{user_id}",
    response_model=DatePreferenceProfile,
    summary="Get user's date planning preferences",
)
def get_user_preferences(
    user_id: str,
    default_name: Optional[str] = "User",
) -> DatePreferenceProfile:
    """Retrieves an individual user's voluntarily shared date planning preferences."""
    return date_planner_service.get_user_preferences(user_id, default_name or "User")


@router.post(
    "/preferences/{user_id}",
    response_model=DatePreferenceProfile,
    summary="Save or update user's date planning preferences",
)
def update_user_preferences(
    user_id: str,
    preferences: DatePreferenceProfile,
) -> DatePreferenceProfile:
    """Updates an individual user's date planning preferences independently."""
    return date_planner_service.save_user_preferences(user_id, preferences)


@router.post(
    "/plan",
    response_model=DatePlanResponse,
    summary="Generate personalized AI date concepts and itineraries",
)
def generate_date_plan(
    payload: DatePlanningRequest,
) -> DatePlanResponse:
    """
    Synthesizes both users' profile intelligence, voluntary date preferences,
    budget constraints, and target city to generate 3 tailored date concepts.
    """
    try:
        return date_planner_service.generate_date_plan(payload)
    except Exception as exc:
        logger.error(f"Error generating date plan: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Date planner engine failure: {str(exc)}",
        )
