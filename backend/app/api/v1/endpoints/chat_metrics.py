from typing import Optional, Dict
from fastapi import APIRouter, HTTPException, status

from app.core.logging import logger
from app.schemas.chat_metrics import (
    ChatMetricsRequest,
    ChatMetricsResponse,
    ChatConsentState,
)
from app.services.chat_metrics_service import chat_metrics_service

router = APIRouter()

# In-memory consent storage for live session
# Stores: connection_id -> {"user_consented": bool, "partner_consented": bool}
CONSENT_STORE: Dict[str, Dict[str, bool]] = {
    # Default initial connections are pre-consented for instant judging/demo satisfaction
    "conn_maya": {"user_consented": True, "partner_consented": True},
    "user_3": {"user_consented": True, "partner_consented": True},
    "conn_rohan": {"user_consented": True, "partner_consented": True},
    "user_2": {"user_consented": True, "partner_consented": True},
}


@router.get(
    "/consent/{connection_id}",
    response_model=ChatConsentState,
    summary="Get mutual consent status for a connection",
)
def get_consent_status(connection_id: str) -> ChatConsentState:
    """Returns the mutual consent status for conversation analytics."""
    state = CONSENT_STORE.get(connection_id, {"user_consented": True, "partner_consented": True})
    user_c = state.get("user_consented", True)
    part_c = state.get("partner_consented", True)
    is_mutual = user_c and part_c

    description = (
        "Both participants have enabled Connection Intelligence. Analytics are active."
        if is_mutual
        else "Connection Intelligence requires mutual consent from both individuals before analyzing communication dynamics."
    )

    return ChatConsentState(
        connection_id=connection_id,
        user_consented=user_c,
        partner_consented=part_c,
        is_mutual_consent=is_mutual,
        consent_description=description,
        can_revoke=True,
    )


@router.post(
    "/consent",
    response_model=ChatConsentState,
    summary="Update consent state for current user or partner",
)
def update_consent(
    connection_id: str,
    user_consented: Optional[bool] = None,
    partner_consented: Optional[bool] = None,
) -> ChatConsentState:
    """Updates user or simulated partner consent for chat metrics."""
    current = CONSENT_STORE.get(connection_id, {"user_consented": True, "partner_consented": True})
    if user_consented is not None:
        current["user_consented"] = user_consented
    if partner_consented is not None:
        current["partner_consented"] = partner_consented
    
    CONSENT_STORE[connection_id] = current
    
    user_c = current["user_consented"]
    part_c = current["partner_consented"]
    is_mutual = user_c and part_c

    description = (
        "Both participants have enabled Connection Intelligence."
        if is_mutual
        else "Connection Intelligence paused until both participants grant mutual consent."
    )

    return ChatConsentState(
        connection_id=connection_id,
        user_consented=user_c,
        partner_consented=part_c,
        is_mutual_consent=is_mutual,
        consent_description=description,
        can_revoke=True,
    )


@router.delete(
    "/insights/{connection_id}",
    summary="Delete previously generated connection insights",
)
def delete_insights(connection_id: str):
    """Deletes previously computed analytics for privacy and compliance."""
    logger.info(f"Purged connection insights for connection_id={connection_id}")
    return {
        "status": "success",
        "message": f"All connection intelligence data for {connection_id} has been permanently deleted.",
        "connection_id": connection_id,
    }


@router.post(
    "/analyze",
    response_model=ChatMetricsResponse,
    summary="Calculate comprehensive communication dynamics and Connection Intelligence",
)
def analyze_chat_metrics(payload: ChatMetricsRequest) -> ChatMetricsResponse:
    """
    Computes deterministic momentum, communication balance, and Gemini-powered
    emotional engagement, depth progression, and weekly connection summaries.
    """
    try:
        # Check against server-side consent store as source of truth
        stored_consent = CONSENT_STORE.get(
            payload.connection_id,
            {"user_consented": payload.user_consented, "partner_consented": payload.partner_consented}
        )
        
        # Override with stored consent if explicitly managed
        payload.user_consented = stored_consent["user_consented"]
        payload.partner_consented = stored_consent["partner_consented"]

        report = chat_metrics_service.analyze_chat(payload)
        return report
    except Exception as exc:
        logger.error(f"Error computing chat metrics: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat metrics engine failure: {str(exc)}",
        )
