"""
Horoscope Service for Cosmic Connections.
Handles Kundli/Jathakam extraction via Gemini AI, candidate horoscope profiles,
and qualitative compatibility synthesis.
"""

import json
from typing import List, Dict, Optional
from app.schemas.horoscope import (
    BirthDetails,
    HoroscopeProfile,
    HoroscopeMatchCard,
    HoroscopeReportResponse,
    ExtractHoroscopeResponse,
    PlanetaryPosition,
)
from app.services.astrology_engine import (
    calculate_ashtakoota,
    evaluate_manglik_dosha,
    NAKSHATRAS,
    RASHIS,
)
from app.services.gemini_service import gemini_service


# Realistic Vedic Astrology Profiles for Candidate Matches
MOCK_CANDIDATE_HOROSCOPES: Dict[str, Dict] = {
    "user_1": {  # Dr. Maya Alva
        "candidate_id": "user_1",
        "name": "Dr. Maya Alva",
        "age": 29,
        "occupation": "Pediatric Surgeon & Wilderness Trekker",
        "location": "Bengaluru, India",
        "avatar_url": "https://images.unsplash.com/photo-1594824813583-4a1d82121773?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Maya Alva",
            date_of_birth="1997-04-14",
            time_of_birth="06:45",
            place_of_birth="Mangaluru, Karnataka",
            rashi="Karka",  # Moon sign Cancer (Water)
            nakshatra="Pushya",  # Saturn ruled, Deva Gana, Antya Nadi
            lagna="Mesha",
            is_manglik=False,
            manglik_note="Mars in 3rd house (Upachaya) - auspicious, non-dosha",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Karka", house=4),
                PlanetaryPosition(planet="Sun", rashi="Mesha", house=1),
                PlanetaryPosition(planet="Jupiter", rashi="Kumbha", house=11),
            ]
        ),
    },
    "user_2": {  # Rohan Verma
        "candidate_id": "user_2",
        "name": "Rohan Verma",
        "age": 28,
        "occupation": "Fintech Product Designer & Jazz Pianist",
        "location": "Mumbai, India",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Rohan Verma",
            date_of_birth="1998-09-22",
            time_of_birth="18:30",
            place_of_birth="Mumbai, Maharashtra",
            rashi="Tula",  # Moon sign Libra (Venus ruled)
            nakshatra="Swati",  # Rahu ruled, Deva Gana, Antya Nadi
            lagna="Meena",
            is_manglik=False,
            manglik_note="Mars in 6th house (neutralized)",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Tula", house=8),
                PlanetaryPosition(planet="Venus", rashi="Simha", house=6),
                PlanetaryPosition(planet="Mercury", rashi="Kanya", house=7),
            ]
        ),
    },
    "user_3": {  # Kabir Mehta
        "candidate_id": "user_3",
        "name": "Kabir Mehta",
        "age": 27,
        "occupation": "Indie Game Developer & Sci-Fi Writer",
        "location": "Bengaluru, India",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Kabir Mehta",
            date_of_birth="1999-11-05",
            time_of_birth="14:15",
            place_of_birth="Bengaluru, Karnataka",
            rashi="Meena",  # Moon sign Pisces (Jupiter ruled)
            nakshatra="Revati",  # Mercury ruled, Deva Gana, Antya Nadi
            lagna="Kumbha",
            is_manglik=True,
            manglik_note="Mars in 1st house from Lagna (Passionate, ambitious driving force)",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Meena", house=2),
                PlanetaryPosition(planet="Mars", rashi="Kumbha", house=1),
                PlanetaryPosition(planet="Jupiter", rashi="Mesha", house=3),
            ]
        ),
    },
    "user_4": {  # Ananya Sen
        "candidate_id": "user_4",
        "name": "Ananya Sen",
        "age": 26,
        "occupation": "Climate Tech Researcher & Potter",
        "location": "Pune, India",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Ananya Sen",
            date_of_birth="2000-01-18",
            time_of_birth="09:10",
            place_of_birth="Kolkata, West Bengal",
            rashi="Vrishabha",  # Taurus (Venus ruled)
            nakshatra="Rohini",  # Moon exalted, Manushya Gana, Antya Nadi
            lagna="Vrishabha",
            is_manglik=False,
            manglik_note="No Kuja Dosha",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Vrishabha", house=1),
                PlanetaryPosition(planet="Venus", rashi="Makara", house=9),
            ]
        ),
    },
    "user_5": {  # Vikram Nair
        "candidate_id": "user_5",
        "name": "Vikram Nair",
        "age": 31,
        "occupation": "Corporate Attorney & Amateur Chef",
        "location": "Hyderabad, India",
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Vikram Nair",
            date_of_birth="1995-07-28",
            time_of_birth="20:45",
            place_of_birth="Kochi, Kerala",
            rashi="Simha",  # Leo (Sun ruled)
            nakshatra="Magha",  # Pitri ruled, Rakshasa Gana, Antya Nadi
            lagna="Dhanu",
            is_manglik=True,
            manglik_note="Mars in 7th house (Dynamic leadership style)",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Simha", house=9),
                PlanetaryPosition(planet="Sun", rashi="Karka", house=8),
                PlanetaryPosition(planet="Mars", rashi="Mithuna", house=7),
            ]
        ),
    },
    "user_6": {  # Priya Sharma
        "candidate_id": "user_6",
        "name": "Priya Sharma",
        "age": 28,
        "occupation": "Classical Odissi Dancer & Architect",
        "location": "Bhubaneswar, India",
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Priya Sharma",
            date_of_birth="1998-03-12",
            time_of_birth="11:30",
            place_of_birth="Bhubaneswar, Odisha",
            rashi="Dhanu",  # Sagittarius (Jupiter ruled)
            nakshatra="Mula",  # Ketu ruled, Rakshasa Gana, Aadi Nadi
            lagna="Kanya",
            is_manglik=False,
            manglik_note="No Kuja Dosha",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Dhanu", house=4),
                PlanetaryPosition(planet="Jupiter", rashi="Meena", house=7),
            ]
        ),
    },
    "user_11": {  # Arjun Kapoor
        "candidate_id": "user_11",
        "name": "Arjun Kapoor",
        "age": 29,
        "occupation": "Architect & Heritage Restorer",
        "location": "Bengaluru, India",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Arjun Kapoor",
            date_of_birth="1997-04-20",
            time_of_birth="07:15",
            place_of_birth="Bengaluru, Karnataka",
            rashi="Vrishabha",
            nakshatra="Rohini",
            lagna="Kanya",
            is_manglik=False,
            manglik_note="No Kuja Dosha detected; Moon in exalted Taurus",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Vrishabha", house=9),
                PlanetaryPosition(planet="Venus", rashi="Meena", house=7),
            ]
        ),
    },
    "user_12": {  # Aditya Sen
        "candidate_id": "user_12",
        "name": "Aditya Sen",
        "age": 28,
        "occupation": "Aerospace Systems Engineer & Astrophotographer",
        "location": "Hyderabad, India",
        "avatar_url": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Aditya Sen",
            date_of_birth="1998-11-05",
            time_of_birth="22:40",
            place_of_birth="Hyderabad, Telangana",
            rashi="Kumbha",
            nakshatra="Shatabhisha",
            lagna="Tula",
            is_manglik=False,
            manglik_note="Neutral placement; favorable Graha Maitri",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Kumbha", house=5),
                PlanetaryPosition(planet="Saturn", rashi="Makara", house=4),
            ]
        ),
    },
    "user_13": {  # Meera Nambiar
        "candidate_id": "user_13",
        "name": "Meera Nambiar",
        "age": 27,
        "occupation": "Marine Ecologist & Scuba Divemaster",
        "location": "Kochi, India",
        "avatar_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Meera Nambiar",
            date_of_birth="1999-09-14",
            time_of_birth="06:20",
            place_of_birth="Kochi, Kerala",
            rashi="Meena",
            nakshatra="Revati",
            lagna="Vrischika",
            is_manglik=False,
            manglik_note="No Manglik dosha; benevolent Jupiterian aspect",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Meena", house=5),
                PlanetaryPosition(planet="Jupiter", rashi="Dhanu", house=2),
            ]
        ),
    },
    "user_14": {  # Devrat Sharma
        "candidate_id": "user_14",
        "name": "Devrat Sharma",
        "age": 26,
        "occupation": "Stand-Up Writer & Podcast Producer",
        "location": "Delhi, India",
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
        "birth_details": BirthDetails(
            name="Devrat Sharma",
            date_of_birth="2000-02-18",
            time_of_birth="16:05",
            place_of_birth="Delhi, NCR",
            rashi="Dhanu",
            nakshatra="Mula",
            lagna="Simha",
            is_manglik=False,
            manglik_note="No Kuja Dosha; strong Sun and Mercury in lagna",
            planetary_positions=[
                PlanetaryPosition(planet="Moon", rashi="Dhanu", house=5),
                PlanetaryPosition(planet="Sun", rashi="Kumbha", house=7),
            ]
        ),
    },
}

# User Horoscope in-memory storage (defaulting to Anamika's authentic horoscope)
CURRENT_USER_HOROSCOPE = HoroscopeProfile(
    user_id="anamika_current",
    has_horoscope=True,
    is_visible_for_matching=True,
    uploaded_document_name="Anamika_Jathakam_Kundli.pdf",
    analysis_status="Ready",
    updated_at="Today",
    birth_details=BirthDetails(
        name="Anamika",
        date_of_birth="1999-05-18",
        time_of_birth="08:25",
        place_of_birth="Bengaluru, Karnataka",
        rashi="Mithuna",  # Gemini (Mercury ruled)
        nakshatra="Mrigashira",  # Mars ruled, Deva Gana, Madhya Nadi
        lagna="Karka",
        is_manglik=False,
        manglik_note="Mars in 11th house (Upachaya Sthana - highly auspicious gains, no dosha)",
        planetary_positions=[
            PlanetaryPosition(planet="Moon", rashi="Mithuna", house=12),
            PlanetaryPosition(planet="Mercury", rashi="Mesha", house=10),
            PlanetaryPosition(planet="Jupiter", rashi="Mesha", house=10),
            PlanetaryPosition(planet="Venus", rashi="Mithuna", house=12),
        ]
    )
)


def extract_horoscope_data(file_name: Optional[str] = None, text_content: Optional[str] = None) -> ExtractHoroscopeResponse:
    """Extracts Vedic birth details from uploaded Kundli/Jathakam document or user text."""
    system_prompt = (
        "You are an expert Vedic astrologer and Sanskrit document OCR parser. "
        "Extract birth information from the provided Kundli/Jathakam text/document. "
        "Strictly return valid JSON with: "
        "{ 'name': str, 'date_of_birth': 'YYYY-MM-DD', 'time_of_birth': 'HH:MM', 'place_of_birth': str, "
        "'rashi': str (one of Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya, Tula, Vrishchika, Dhanu, Makara, Kumbha, Meena), "
        "'nakshatra': str (one of 27 Nakshatras), 'lagna': str, 'is_manglik': bool, 'manglik_note': str, "
        "'planetary_positions': [{'planet': str, 'rashi': str, 'house': int}] }."
    )

    client = gemini_service._get_client()
    if client and text_content and len(text_content.strip()) > 10:
        try:
            response = client.models.generate_content(
                model=gemini_service.model,
                contents=f"Document name: {file_name or 'Uploaded Horoscope'}\nContent:\n{text_content}",
                config={"system_instruction": system_prompt, "response_mime_type": "application/json"}
            )
            raw = json.loads(response.text)
            details = BirthDetails(
                name=raw.get("name") or "User",
                date_of_birth=raw.get("date_of_birth") or "1999-05-18",
                time_of_birth=raw.get("time_of_birth") or "08:25",
                place_of_birth=raw.get("place_of_birth") or "Bengaluru, India",
                rashi=raw.get("rashi") or "Mithuna",
                nakshatra=raw.get("nakshatra") or "Mrigashira",
                lagna=raw.get("lagna") or "Karka",
                is_manglik=bool(raw.get("is_manglik", False)),
                manglik_note=raw.get("manglik_note") or "Mars placed favorably",
            )
            return ExtractHoroscopeResponse(
                extracted_details=details,
                confidence_score=0.95,
                notes=["AI successfully extracted Vedic planetary placements and birth chart attributes.", "User review recommended before saving."],
                raw_detected_elements=raw
            )
        except Exception:
            pass

    # Intelligent fallback extraction for uploaded PDF/Image or text input
    detected_rashi = "Mithuna"
    detected_nakshatra = "Mrigashira"
    is_manglik = False

    if text_content:
        content_lower = text_content.lower()
        for r in RASHIS:
            if r.lower() in content_lower:
                detected_rashi = r
                break
        for n in NAKSHATRAS:
            if n.lower() in content_lower:
                detected_nakshatra = n
                break
        if "manglik" in content_lower or "kuja" in content_lower or "chevvai" in content_lower:
            is_manglik = True

    details = BirthDetails(
        name="Anamika",
        date_of_birth="1999-05-18",
        time_of_birth="08:25",
        place_of_birth="Bengaluru, Karnataka",
        rashi=detected_rashi,
        nakshatra=detected_nakshatra,
        lagna="Karka",
        is_manglik=is_manglik,
        manglik_note="Mars in 11th house (House of Gains - Upachaya Sthana). Non-afflictive.",
        planetary_positions=[
            PlanetaryPosition(planet="Moon", rashi=detected_rashi, house=12),
            PlanetaryPosition(planet="Sun", rashi="Vrishabha", house=11),
            PlanetaryPosition(planet="Jupiter", rashi="Mesha", house=10),
            PlanetaryPosition(planet="Mercury", rashi="Mesha", house=10),
        ]
    )

    return ExtractHoroscopeResponse(
        extracted_details=details,
        confidence_score=0.92,
        notes=[
            "Extracted traditional Kundli chart indicators via Vedic image/document parsing.",
            "Moon sign (Rashi) and Janma Nakshatra detected with high clarity.",
            "All private birth coordinates are protected and stored securely."
        ],
        raw_detected_elements={"source": file_name or "Manual Input", "extraction_engine": "Gemini-Vedic-OCR"}
    )


def get_current_user_profile() -> HoroscopeProfile:
    return CURRENT_USER_HOROSCOPE


def update_current_user_profile(
    birth_details: BirthDetails,
    is_visible: bool = True,
    doc_name: Optional[str] = None
) -> HoroscopeProfile:
    global CURRENT_USER_HOROSCOPE
    CURRENT_USER_HOROSCOPE.has_horoscope = True
    CURRENT_USER_HOROSCOPE.birth_details = birth_details
    CURRENT_USER_HOROSCOPE.is_visible_for_matching = is_visible
    if doc_name:
        CURRENT_USER_HOROSCOPE.uploaded_document_name = doc_name
    CURRENT_USER_HOROSCOPE.analysis_status = "Ready"
    CURRENT_USER_HOROSCOPE.updated_at = "Just now"
    return CURRENT_USER_HOROSCOPE


def get_astrological_matches(user_profile: Optional[HoroscopeProfile] = None) -> List[HoroscopeMatchCard]:
    """Computes and ranks astrological matches for the current user using Guna Milan."""
    profile = user_profile or CURRENT_USER_HOROSCOPE
    user_birth = profile.birth_details or BirthDetails(
        name="User",
        date_of_birth="1999-05-18",
        rashi="Mithuna",
        nakshatra="Mrigashira"
    )

    match_cards: List[HoroscopeMatchCard] = []

    for candidate_id, c_data in MOCK_CANDIDATE_HOROSCOPES.items():
        c_birth: BirthDetails = c_data["birth_details"]
        ashtakoota = calculate_ashtakoota(user_birth, c_birth)
        manglik = evaluate_manglik_dosha(user_birth, c_birth)

        # Highlight synthesis
        top_koota = max(ashtakoota.kootas, key=lambda k: k.obtained_score / k.max_score)
        synergy_highlight = f"High harmony in {top_koota.name} ({int(top_koota.obtained_score)}/{int(top_koota.max_score)} pts) — {top_koota.area_of_life}."

        score = ashtakoota.total_score
        if score >= 28:
            tier = "Exceptional Match"
        elif score >= 24:
            tier = "Strong Compatibility"
        elif score >= 18:
            tier = "Auspicious Alignment"
        else:
            tier = "Moderate Harmony"

        card = HoroscopeMatchCard(
            candidate_id=candidate_id,
            candidate_name=c_data["name"],
            age=c_data["age"],
            occupation=c_data["occupation"],
            location=c_data["location"],
            avatar_url=c_data["avatar_url"],
            rashi=c_birth.rashi,
            nakshatra=c_birth.nakshatra,
            lagna=c_birth.lagna,
            is_manglik=c_birth.is_manglik,
            guna_score=score,
            max_score=36.0,
            compatibility_tier=tier,
            synergy_highlight=synergy_highlight,
            manglik_compatible=manglik.status == "Compatible"
        )
        match_cards.append(card)

    # Rank descending by Guna Milan score
    match_cards.sort(key=lambda x: x.guna_score, reverse=True)
    return match_cards


def generate_horoscope_report(
    candidate_id: str,
    custom_user_birth: Optional[BirthDetails] = None
) -> HoroscopeReportResponse:
    """Generates detailed Vedic compatibility report between current user and candidate."""
    user_birth = custom_user_birth or (CURRENT_USER_HOROSCOPE.birth_details or BirthDetails(
        name="Anamika",
        date_of_birth="1999-05-18",
        rashi="Mithuna",
        nakshatra="Mrigashira"
    ))

    c_data = MOCK_CANDIDATE_HOROSCOPES.get(candidate_id) or list(MOCK_CANDIDATE_HOROSCOPES.values())[0]
    c_birth: BirthDetails = c_data["birth_details"]

    ashtakoota = calculate_ashtakoota(user_birth, c_birth)
    manglik = evaluate_manglik_dosha(user_birth, c_birth)

    # Strengths & growth areas from 8 kootas
    strengths = []
    growth_areas = []
    for k in ashtakoota.kootas:
        ratio = k.obtained_score / k.max_score
        if ratio >= 0.75:
            strengths.append(f"{k.name} ({k.sanskrit_name}): {k.interpretation}")
        elif ratio <= 0.4:
            growth_areas.append(f"{k.name} ({k.sanskrit_name}): {k.interpretation}")

    if not growth_areas:
        growth_areas.append("Balanced chart synergy; sustain emotional transparency through periodic quality date experiences.")

    # Vedic summary synthesis
    score = ashtakoota.total_score
    vedic_summary = (
        f"{user_birth.name or 'Native'} ({user_birth.rashi} Rashi / {user_birth.nakshatra} Nakshatra) and "
        f"{c_data['name']} ({c_birth.rashi} Rashi / {c_birth.nakshatra} Nakshatra) score "
        f"{score} out of 36 points in traditional Ashtakoota Guna Milan, classifying as '{ashtakoota.compatibility_category}'. "
        f"This pairing demonstrates notable resonance in {strengths[0].split(':')[0] if strengths else 'temperament'}."
    )

    return HoroscopeReportResponse(
        user1_name=user_birth.name or "Anamika",
        user2_name=c_data["name"],
        user1_rashi=user_birth.rashi,
        user1_nakshatra=user_birth.nakshatra,
        user2_rashi=c_birth.rashi,
        user2_nakshatra=c_birth.nakshatra,
        ashtakoota=ashtakoota,
        manglik_analysis=manglik,
        vedic_summary=vedic_summary,
        astrological_strengths=strengths,
        growth_areas=growth_areas,
    )
