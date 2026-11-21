"""
API endpoints for Horoscope Match (Cosmic Connections).
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.horoscope import (
    HoroscopeProfile,
    HoroscopeMatchCard,
    HoroscopeReportResponse,
    ExtractHoroscopeRequest,
    ExtractHoroscopeResponse,
    CompareHoroscopesRequest,
    BirthDetails,
)
from app.services.horoscope_service import (
    get_current_user_profile,
    update_current_user_profile,
    get_astrological_matches,
    generate_horoscope_report,
    extract_horoscope_data,
)

router = APIRouter()


@router.get("/profile/{user_id}", response_model=HoroscopeProfile)
def get_user_horoscope(user_id: str):
    """Retrieve user's stored horoscope profile."""
    return get_current_user_profile()


@router.post("/profile/{user_id}", response_model=HoroscopeProfile)
def save_user_horoscope(user_id: str, birth_details: BirthDetails, is_visible: bool = True, doc_name: Optional[str] = None):
    """Save or update user's horoscope birth details and matching privacy preference."""
    return update_current_user_profile(birth_details, is_visible, doc_name)


@router.post("/extract", response_model=ExtractHoroscopeResponse)
def extract_horoscope(request: ExtractHoroscopeRequest):
    """Extract birth details from uploaded Kundli/Jathakam document or text using Gemini AI."""
    return extract_horoscope_data(file_name=request.file_name, text_content=request.text_content)


@router.get("/matches", response_model=List[HoroscopeMatchCard])
def list_horoscope_matches():
    """Retrieve candidate profiles ranked by deterministic Vedic Guna Milan score."""
    return get_astrological_matches()


@router.post("/compare", response_model=HoroscopeReportResponse)
def compare_horoscopes(request: CompareHoroscopesRequest):
    """Generate detailed 36-point Ashtakoota compatibility report for a candidate."""
    try:
        return generate_horoscope_report(
            candidate_id=request.candidate_id,
            custom_user_birth=request.user_birth_details
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate horoscope report: {str(e)}")
