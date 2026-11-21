from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import __version__
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import logger, setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager."""
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} v{__version__} [{settings.ENVIRONMENT}]")
    logger.info(f"Allowed CORS origins: {settings.BACKEND_CORS_ORIGINS}")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=__version__,
    description="Backend API for AI Dating & People Networking Platform",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Standardized handler for HTTP exceptions."""
    logger.warning(f"HTTP {exc.status_code} error on {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": str(exc.detail),
                "details": None,
            }
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Standardized handler for schema validation errors."""
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "The submitted payload failed schema validation.",
                "details": jsonable_encoder(exc.errors()),
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Standardized handler for unhandled server exceptions."""
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": f"Server error: {str(exc)}",
                "details": str(exc),
            }
        },
    )


# Include API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Serve Frontend SPA if built distribution exists
import os
from fastapi.staticfiles import StaticFiles

possible_dist_paths = [
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"),
    os.path.join(os.getcwd(), "frontend", "dist"),
    "/app/frontend/dist",
]

dist_path = None
for p in possible_dist_paths:
    if os.path.exists(p) and os.path.exists(os.path.join(p, "index.html")):
        dist_path = p
        break

if dist_path:
    logger.info(f"Serving frontend SPA from: {dist_path}")
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="frontend")
else:
    # Root entry fallback for API-only mode
    @app.get("/", tags=["Root"])
    async def root() -> dict:
        """Root endpoint providing service metadata and discovery links."""
        return {
            "service": settings.PROJECT_NAME,
            "version": __version__,
            "docs": f"{settings.API_V1_STR}/docs",
            "health": f"{settings.API_V1_STR}/health",
        }
