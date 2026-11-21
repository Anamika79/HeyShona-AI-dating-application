from fastapi import APIRouter
from app.api.v1.endpoints import (
    chat_metrics,
    compatibility,
    cupid,
    date_planner,
    health,
    horoscope,
    profile_intelligence,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(
    profile_intelligence.router,
    prefix="/profile-intelligence",
    tags=["Profile Intelligence"],
)
api_router.include_router(
    compatibility.router,
    prefix="/compatibility",
    tags=["AI Compatibility Engine"],
)
api_router.include_router(
    cupid.router,
    prefix="/cupid",
    tags=["Cupid AI Dating Assistant"],
)
api_router.include_router(
    chat_metrics.router,
    prefix="/chat-metrics",
    tags=["AI Chat Metrics - Connection Intelligence"],
)
api_router.include_router(
    date_planner.router,
    prefix="/date-planner",
    tags=["AI Personalized Date Planner"],
)
api_router.include_router(
    horoscope.router,
    prefix="/horoscope",
    tags=["Cosmic Connections - Horoscope Match"],
)
