import pytest
from app.schemas.horoscope import BirthDetails
from app.services.astrology_engine import (
    calculate_ashtakoota,
    evaluate_manglik_dosha,
    calculate_varna,
    calculate_vashya,
    calculate_tara,
    calculate_yoni,
    calculate_graha_maitri,
    calculate_gana,
    calculate_bhakoot,
    calculate_nadi,
)
from app.services.horoscope_service import (
    get_astrological_matches,
    generate_horoscope_report,
    get_current_user_profile,
)


def test_ashtakoota_deterministic_scoring():
    """Verify that Ashtakoota generates a consistent deterministic score out of 36."""
    user1 = BirthDetails(
        name="Anamika",
        date_of_birth="1999-05-18",
        rashi="Mithuna",
        nakshatra="Mrigashira",
        is_manglik=False
    )
    user2 = BirthDetails(
        name="Rohan",
        date_of_birth="1998-09-22",
        rashi="Tula",
        nakshatra="Swati",
        is_manglik=False
    )

    result = calculate_ashtakoota(user1, user2)
    assert result.max_score == 36.0
    assert 0 <= result.total_score <= 36.0
    assert len(result.kootas) == 8

    # Check koota dimension names
    names = [k.name for k in result.kootas]
    assert "Varna" in names
    assert "Vashya" in names
    assert "Tara" in names
    assert "Yoni" in names
    assert "Graha Maitri" in names
    assert "Gana" in names
    assert "Bhakoot" in names
    assert "Nadi" in names


def test_individual_kootas():
    # Varna
    score, _ = calculate_varna("Karka", "Meena")
    assert score == 1.0

    # Nadi (Diverse nadis get full 8 points)
    # Mrigashira is Madhya, Swati is Antya -> Different nadis
    nadi_score, _ = calculate_nadi("Mrigashira", "Swati")
    assert nadi_score == 8.0

    # Manglik Dosha
    b1 = BirthDetails(date_of_birth="1999-01-01", rashi="Mesha", nakshatra="Ashwini", is_manglik=True)
    b2 = BirthDetails(date_of_birth="1999-01-01", rashi="Simha", nakshatra="Magha", is_manglik=True)
    manglik_res = evaluate_manglik_dosha(b1, b2)
    assert manglik_res.status == "Compatible"


def test_horoscope_matches_and_report():
    matches = get_astrological_matches()
    assert len(matches) > 0
    # First match should have high Guna Milan score
    assert matches[0].guna_score >= matches[-1].guna_score

    report = generate_horoscope_report(matches[0].candidate_id)
    assert report.ashtakoota.total_score > 0
    assert len(report.astrological_strengths) > 0
    assert report.disclaimer is not None
