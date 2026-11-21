from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class PlanetaryPosition(BaseModel):
    planet: str = Field(..., description="Planet name, e.g. Moon, Mars, Sun, Venus, Jupiter")
    rashi: str = Field(..., description="Zodiac sign, e.g. Mesha, Vrishabha, Mithuna")
    house: int = Field(..., description="House number 1-12")
    degree: Optional[str] = Field(None, description="Degree and minutes if available")


class BirthDetails(BaseModel):
    name: Optional[str] = Field(None, description="Native name")
    date_of_birth: str = Field(..., description="Birth date YYYY-MM-DD")
    time_of_birth: Optional[str] = Field(None, description="Birth time HH:MM (kept private)")
    place_of_birth: Optional[str] = Field(None, description="Birth city/state (kept private)")
    rashi: str = Field(..., description="Moon sign / Rashi (e.g. Mesha, Vrishabha, Mithuna, etc.)")
    nakshatra: str = Field(..., description="Birth star / Nakshatra (e.g. Rohini, Ashwini, etc.)")
    lagna: Optional[str] = Field(None, description="Ascendant / Lagna sign")
    is_manglik: bool = Field(False, description="Whether Mars placement creates Manglik Dosha")
    manglik_note: Optional[str] = Field(None, description="Brief note on Mars placement")
    planetary_positions: Optional[List[PlanetaryPosition]] = Field(default_factory=list)


class GunaKoota(BaseModel):
    name: str = Field(..., description="Dimension name: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi")
    sanskrit_name: str
    max_score: float
    obtained_score: float
    area_of_life: str = Field(..., description="What this dimension represents (e.g. Temperament, Genetic health)")
    interpretation: str = Field(..., description="Traditional Vedic meaning and result explanation")


class AshtakootaResult(BaseModel):
    total_score: float = Field(..., description="Total points obtained out of 36")
    max_score: float = 36.0
    favorable: bool = Field(..., description="Whether score >= 18 (traditional threshold)")
    compatibility_category: str = Field(..., description="Exceptional (28-36), Favorable (18-27), Moderate (14-17), Needs Remedy (<14)")
    kootas: List[GunaKoota] = Field(..., description="Detailed 8 Koota breakdown")


class ManglikAnalysis(BaseModel):
    user1_manglik: bool
    user2_manglik: bool
    status: str = Field(..., description="Compatible, Balanced, or Requires Consultation")
    summary: str = Field(..., description="Detailed traditional explanation of Mars balance")


class HoroscopeProfile(BaseModel):
    user_id: str
    has_horoscope: bool = False
    birth_details: Optional[BirthDetails] = None
    is_visible_for_matching: bool = True
    uploaded_document_name: Optional[str] = None
    analysis_status: str = "Ready"  # 'Ready', 'Pending', 'Incomplete'
    updated_at: Optional[str] = None


class HoroscopeMatchCard(BaseModel):
    candidate_id: str
    candidate_name: str
    age: int
    occupation: str
    location: str
    avatar_url: str
    rashi: str
    nakshatra: str
    lagna: Optional[str] = None
    is_manglik: bool = False
    guna_score: float
    max_score: float = 36.0
    compatibility_tier: str  # 'Exceptional Match' (>28), 'Strong Compatibility' (24-28), 'Auspicious' (18-23), 'Average' (<18)
    synergy_highlight: str
    manglik_compatible: bool


class HoroscopeReportResponse(BaseModel):
    user1_name: str
    user2_name: str
    user1_rashi: str
    user1_nakshatra: str
    user2_rashi: str
    user2_nakshatra: str
    ashtakoota: AshtakootaResult
    manglik_analysis: ManglikAnalysis
    vedic_summary: str
    astrological_strengths: List[str]
    growth_areas: List[str]
    disclaimer: str = Field(
        default="Vedic horoscope compatibility (Kundli Milan) is based on ancient traditional principles and cultural heritage. It provides symbolic guidance and should not be treated as scientific fact or an absolute guarantee of relationship viability. Love, mutual respect, open communication, and shared values remain paramount."
    )


class ManualBirthInput(BaseModel):
    name: Optional[str] = None
    date_of_birth: str
    time_of_birth: Optional[str] = None
    place_of_birth: Optional[str] = None
    rashi: str
    nakshatra: str
    lagna: Optional[str] = None
    is_manglik: Optional[bool] = False


class ExtractHoroscopeRequest(BaseModel):
    file_name: Optional[str] = None
    text_content: Optional[str] = None


class ExtractHoroscopeResponse(BaseModel):
    extracted_details: BirthDetails
    confidence_score: float
    notes: List[str]
    raw_detected_elements: Dict[str, Any] = Field(default_factory=dict)


class CompareHoroscopesRequest(BaseModel):
    user_id: str
    candidate_id: str
    user_birth_details: Optional[BirthDetails] = None
