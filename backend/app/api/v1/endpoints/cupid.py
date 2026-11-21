from fastapi import APIRouter, Depends, HTTPException, status
from app.core.logging import logger
from app.schemas.cupid import CupidAdviceRequest, CupidAdviceResponse
from app.schemas.error import StandardErrorResponse
from app.services.cupid_service import CupidService, cupid_service

router = APIRouter()


def get_cupid_service() -> CupidService:
    return cupid_service


@router.post(
    "/advice",
    response_model=CupidAdviceResponse,
    summary="Generate Cupid dating coaching, conversation starters and revival tips",
    responses={
        200: {"description": "Cupid guidance successfully generated."},
        500: {"model": StandardErrorResponse},
    },
)
def get_cupid_advice(
    payload: CupidAdviceRequest,
    service: CupidService = Depends(get_cupid_service),
) -> CupidAdviceResponse:
    """
    Acts as Cupid AI Dating Assistant 🏹: generates personalized conversation starters,
    topics to revive conversation, and communication guidance based on match profile.
    """
    try:
        return service.generate_advice(payload)
    except Exception as exc:
        logger.error(f"Error in Cupid AI service: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cupid assistant error: {str(exc)}",
        )
