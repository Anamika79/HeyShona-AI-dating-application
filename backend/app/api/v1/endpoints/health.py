import asyncio
from datetime import datetime, timezone
from fastapi import APIRouter, status, Response
from app import __version__
from app.core.config import settings
from app.db.session import check_db_connection
from app.schemas.health import HealthCheckResponse, DatabaseHealth

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health Diagnostics",
    description="Returns service metadata, runtime environment, and live database connectivity status.",
)
async def get_health(response: Response) -> HealthCheckResponse:
    """Verifies service responsiveness and database connectivity."""
    db_result = await asyncio.to_thread(check_db_connection)
    is_healthy = db_result.get("connected", False)

    if not is_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return HealthCheckResponse(
        status="healthy" if is_healthy else "degraded",
        service=settings.PROJECT_NAME,
        version=__version__,
        environment=settings.ENVIRONMENT,
        database=DatabaseHealth(
            connected=is_healthy,
            dialect=db_result.get("dialect", "unknown"),
            error=db_result.get("error"),
        ),
        timestamp=datetime.now(timezone.utc),
    )
