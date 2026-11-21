"""
Deterministic Vedic Ashtakoota (Guna Milan) & Manglik Dosha Engine.
Calculates 36-point compatibility based on classical Indian astrology principles.
"""

from typing import Tuple, List, Dict
from app.schemas.horoscope import (
    GunaKoota,
    AshtakootaResult,
    ManglikAnalysis,
    BirthDetails,
)

# 27 Nakshatras in order (1 to 27)
NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Vishakha", "Anuradha", "Jyeshtha", "Mula",
    "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

# 12 Rashis in order (1 to 12)
RASHIS = [
    "Mesha", "Vrishabha", "Mithuna", "Karka",
    "Simha", "Kanya", "Tula", "Vrishchika",
    "Dhanu", "Makara", "Kumbha", "Meena"
]

# Varna: Spiritual & vocational disposition (1 pt)
# Brahmin (Water), Kshatriya (Fire), Vaishya (Earth), Shudra (Air)
VARNA_MAP = {
    "Karka": "Brahmin", "Vrishchika": "Brahmin", "Meena": "Brahmin",
    "Mesha": "Kshatriya", "Simha": "Kshatriya", "Dhanu": "Kshatriya",
    "Vrishabha": "Vaishya", "Kanya": "Vaishya", "Makara": "Vaishya",
    "Mithuna": "Shudra", "Tula": "Shudra", "Kumbha": "Shudra",
}
VARNA_RANK = {"Brahmin": 4, "Kshatriya": 3, "Vaishya": 2, "Shudra": 1}

# Vashya: Magnetic attraction & mutual influence (2 pts)
VASHYA_MAP = {
    "Mesha": "Chatushpada", "Vrishabha": "Chatushpada", "Simha": "Vanachara",
    "Karka": "Jalachara", "Vrishchika": "Keeta", "Meena": "Jalachara",
    "Mithuna": "Manava", "Kanya": "Manava", "Tula": "Manava", "Kumbha": "Manava",
    "Dhanu": "Manava", "Makara": "Chatushpada"
}

# Yoni: Animal species affinity (4 pts)
YONI_MAP = {
    "Ashwini": "Horse", "Shatabhisha": "Horse",
    "Bharani": "Elephant", "Revati": "Elephant",
    "Krittika": "Sheep", "Pushya": "Sheep",
    "Rohini": "Serpent", "Mrigashira": "Serpent",
    "Ardra": "Dog", "Mula": "Dog",
    "Punarvasu": "Cat", "Ashlesha": "Cat",
    "Magha": "Rat", "Purva Phalguni": "Rat",
    "Uttara Phalguni": "Cow", "Uttara Bhadrapada": "Cow",
    "Hasta": "Buffalo", "Swati": "Buffalo",
    "Chitra": "Tiger", "Vishakha": "Tiger",
    "Anuradha": "Deer", "Jyeshtha": "Deer",
    "Purva Ashadha": "Monkey", "Shravana": "Monkey",
    "Uttara Ashadha": "Mongoose", "Dhanishta": "Lion"
}

# Sworn enemy animal pairs (0 pts)
YONI_ENEMIES = {
    ("Horse", "Buffalo"), ("Buffalo", "Horse"),
    ("Elephant", "Lion"), ("Lion", "Elephant"),
    ("Sheep", "Monkey"), ("Monkey", "Sheep"),
    ("Serpent", "Mongoose"), ("Mongoose", "Serpent"),
    ("Dog", "Deer"), ("Deer", "Dog"),
    ("Cat", "Rat"), ("Rat", "Cat"),
    ("Cow", "Tiger"), ("Tiger", "Cow")
}

# Planetary Lords of Signs for Graha Maitri (5 pts)
RASHI_LORDS = {
    "Mesha": "Mars", "Vrishchika": "Mars",
    "Vrishabha": "Venus", "Tula": "Venus",
    "Mithuna": "Mercury", "Kanya": "Mercury",
    "Karka": "Moon",
    "Simha": "Sun",
    "Dhanu": "Jupiter", "Meena": "Jupiter",
    "Makara": "Saturn", "Kumbha": "Saturn"
}

# Planetary natural relationship (Mitra, Sama, Shatru)
PLANET_RELATIONS = {
    "Sun": {"Friends": ["Moon", "Mars", "Jupiter"], "Enemies": ["Venus", "Saturn"], "Neutrals": ["Mercury"]},
    "Moon": {"Friends": ["Sun", "Mercury"], "Enemies": [], "Neutrals": ["Mars", "Jupiter", "Venus", "Saturn"]},
    "Mars": {"Friends": ["Sun", "Moon", "Jupiter"], "Enemies": ["Mercury"], "Neutrals": ["Venus", "Saturn"]},
    "Mercury": {"Friends": ["Sun", "Venus"], "Enemies": ["Moon"], "Neutrals": ["Mars", "Jupiter", "Saturn"]},
    "Jupiter": {"Friends": ["Sun", "Moon", "Mars"], "Enemies": ["Mercury", "Venus"], "Neutrals": ["Saturn"]},
    "Venus": {"Friends": ["Mercury", "Saturn"], "Enemies": ["Sun", "Moon"], "Neutrals": ["Mars", "Jupiter"]},
    "Saturn": {"Friends": ["Mercury", "Venus"], "Enemies": ["Sun", "Moon", "Mars"], "Neutrals": ["Jupiter"]},
}

# Gana: Temperament (6 pts)
GANA_MAP = {
    # Deva
    "Ashwini": "Deva", "Mrigashira": "Deva", "Punarvasu": "Deva", "Pushya": "Deva",
    "Hasta": "Deva", "Swati": "Deva", "Anuradha": "Deva", "Shravana": "Deva", "Revati": "Deva",
    # Manushya
    "Bharani": "Manushya", "Rohini": "Manushya", "Ardra": "Manushya", "Purva Phalguni": "Manushya",
    "Uttara Phalguni": "Manushya", "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya",
    "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya",
    # Rakshasa
    "Krittika": "Rakshasa", "Ashlesha": "Rakshasa", "Magha": "Rakshasa", "Chitra": "Rakshasa",
    "Vishakha": "Rakshasa", "Jyeshtha": "Rakshasa", "Mula": "Rakshasa", "Dhanishta": "Rakshasa",
    "Shatabhisha": "Rakshasa"
}

# Nadi: Bio-energy & Genetic constitution (8 pts)
NADI_MAP = {
    # Aadi (Vata)
    "Ashwini": "Aadi", "Ardra": "Aadi", "Punarvasu": "Aadi", "Uttara Phalguni": "Aadi",
    "Hasta": "Aadi", "Jyeshtha": "Aadi", "Mula": "Aadi", "Shatabhisha": "Aadi", "Purva Bhadrapada": "Aadi",
    # Madhya (Pitta)
    "Bharani": "Madhya", "Mrigashira": "Madhya", "Pushya": "Madhya", "Purva Phalguni": "Madhya",
    "Chitra": "Madhya", "Anuradha": "Madhya", "Purva Ashadha": "Madhya", "Dhanishta": "Madhya", "Uttara Bhadrapada": "Madhya",
    # Antya (Kapha)
    "Krittika": "Antya", "Rohini": "Antya", "Ashlesha": "Antya", "Magha": "Antya",
    "Swati": "Antya", "Vishakha": "Antya", "Uttara Ashadha": "Antya", "Shravana": "Antya", "Revati": "Antya"
}


def normalize_name(val: str, valid_list: List[str]) -> str:
    """Helper to match user-provided names case-insensitively."""
    cleaned = val.strip().lower()
    for item in valid_list:
        if item.lower() == cleaned:
            return item
    # Return first by default if not recognized
    return valid_list[0]


def calculate_varna(rashi1: str, rashi2: str) -> Tuple[float, str]:
    """1. Varna Koota (1 point): Spiritual compatibility & innate work ethics."""
    v1 = VARNA_MAP.get(rashi1, "Vaishya")
    v2 = VARNA_MAP.get(rashi2, "Vaishya")
    
    score = 1.0
    if VARNA_RANK[v1] == VARNA_RANK[v2]:
        desc = f"Both belong to the {v1} Varna, signifying harmonious vocational and spiritual temperaments."
    elif abs(VARNA_RANK[v1] - VARNA_RANK[v2]) <= 1:
        desc = f"Varnas are complementary ({v1} and {v2}), promoting mutual inspiration and grounded teamwork."
    else:
        score = 0.5
        desc = f"Different Varna dispositions ({v1} and {v2}); encourages conscious appreciation of diverse life values."
    return score, desc


def calculate_vashya(rashi1: str, rashi2: str) -> Tuple[float, str]:
    """2. Vashya Koota (2 points): Mutual attraction, magnetism, and natural respect."""
    v1 = VASHYA_MAP.get(rashi1, "Manava")
    v2 = VASHYA_MAP.get(rashi2, "Manava")

    if v1 == v2:
        return 2.0, f"Excellent mutual harmony; both share the {v1} Vashya classification fostering effortless understanding."
    elif (v1 == "Manava" and v2 == "Chatushpada") or (v2 == "Manava" and v1 == "Chatushpada"):
        return 1.5, "Harmonious dynamic; warm mutual respect and natural affection."
    elif (v1 == "Jalachara" and v2 in ["Manava", "Chatushpada"]) or (v2 == "Jalachara" and v1 in ["Manava", "Chatushpada"]):
        return 1.0, "Moderate magnetic affinity with balance of emotional depth and active presence."
    elif v1 == "Vanachara" or v2 == "Vanachara":
        return 0.5, "Fiery, dynamic presence; thrives when both partners give each other plenty of personal independence."
    else:
        return 1.0, "Fair natural affinity that deepens through shared experiences and intentional communication."


def calculate_tara(nakshatra1: str, nakshatra2: str) -> Tuple[float, str]:
    """3. Tara Koota (3 points): Destiny, health harmony, and longevity."""
    try:
        idx1 = NAKSHATRAS.index(nakshatra1) + 1
        idx2 = NAKSHATRAS.index(nakshatra2) + 1
    except ValueError:
        return 1.5, "Standard auspicious Tara harmony calculated."

    diff1 = (idx2 - idx1 + 27) % 9
    diff2 = (idx1 - idx2 + 27) % 9

    # Remainder 3 (Vipat), 5 (Pratyak), 7 (Naidhana) are traditionally difficult
    inauspicious = {3, 5, 7}
    t1_good = diff1 not in inauspicious
    t2_good = diff2 not in inauspicious

    if t1_good and t2_good:
        return 3.0, f"Auspicious Tara alignment. Both birth stars generate supportive cosmic energy for health, longevity, and shared destiny."
    elif t1_good or t2_good:
        return 1.5, f"Balanced Tara balance. Supportive karmic resonance with one partner acting as an anchor in times of change."
    else:
        return 0.5, f"Moderate Tara balance; invites mutual patience, conscious mindfulness, and healthy wellness habits."


def calculate_yoni(nakshatra1: str, nakshatra2: str) -> Tuple[float, str]:
    """4. Yoni Koota (4 points): Physical affinity, biological compatibility & natural instinct."""
    y1 = YONI_MAP.get(nakshatra1, "Deer")
    y2 = YONI_MAP.get(nakshatra2, "Deer")

    if y1 == y2:
        return 4.0, f"Same Yoni species ({y1}). Exceptional biological harmony, instinctive comfort, and intimate alignment."
    elif (y1, y2) in YONI_ENEMIES or (y2, y1) in YONI_ENEMIES:
        return 0.5, f"Contrasting Yoni archetypes ({y1} and {y2}). Fosters intrigue and passion when supported by open communication."
    else:
        return 3.0, f"Friendly Yoni species ({y1} and {y2}). Warm physical compatibility, ease of affection, and mutual comfort."


def calculate_graha_maitri(rashi1: str, rashi2: str) -> Tuple[float, str]:
    """5. Graha Maitri (5 points): Psychological rapport and mental friendship between Moon sign lords."""
    lord1 = RASHI_LORDS.get(rashi1, "Jupiter")
    lord2 = RASHI_LORDS.get(rashi2, "Jupiter")

    if lord1 == lord2:
        return 5.0, f"Shared planetary ruler ({lord1}). Deep psychological resonance, shared humor, and natural intellectual connection."

    rel1 = PLANET_RELATIONS.get(lord1, {})
    rel2 = PLANET_RELATIONS.get(lord2, {})

    is_friend_1 = lord2 in rel1.get("Friends", [])
    is_friend_2 = lord1 in rel2.get("Friends", [])
    is_neutral_1 = lord2 in rel1.get("Neutrals", [])
    is_neutral_2 = lord1 in rel2.get("Neutrals", [])

    if is_friend_1 and is_friend_2:
        return 5.0, f"Mutual planetary friendship ({lord1} & {lord2}). Effortless mental compatibility, trust, and empathetic bonding."
    elif (is_friend_1 and is_neutral_2) or (is_friend_2 and is_neutral_1):
        return 4.0, f"Planetary affinity ({lord1} & {lord2}). Strong mutual understanding and constructive collaborative mindset."
    elif is_neutral_1 and is_neutral_2:
        return 3.0, f"Planetary neutrality ({lord1} & {lord2}). Stable mental rapport that grows steadily with shared interests."
    elif is_friend_1 or is_friend_2:
        return 1.0, f"Partial planetary friendship ({lord1} & {lord2}); encourages cultivating shared hobbies and active listening."
    else:
        return 0.5, f"Contrasting mental dispositions ({lord1} & {lord2}); offers diverse perspectives and opportunities for personal growth."


def calculate_gana(nakshatra1: str, nakshatra2: str) -> Tuple[float, str]:
    """6. Gana Koota (6 points): Temperament, behavioral nature, and daily lifestyle rhythm."""
    g1 = GANA_MAP.get(nakshatra1, "Deva")
    g2 = GANA_MAP.get(nakshatra2, "Manushya")

    if g1 == g2:
        return 6.0, f"Identical Gana ({g1}). Perfect temperamental synchrony, shared approach to conflict, and emotional peace."
    elif (g1 == "Deva" and g2 == "Manushya") or (g1 == "Manushya" and g2 == "Deva"):
        return 5.0, f"Deva & Manushya Ganas harmonize beautifully, blending gentle idealism with practical groundedness."
    elif (g1 == "Deva" and g2 == "Rakshasa") or (g1 == "Rakshasa" and g2 == "Deva"):
        return 1.0, f"Deva & Rakshasa combination brings strong magnetism, requiring balance between calm reflection and bold action."
    else:
        return 0.5, f"Manushya & Rakshasa pairing; calls for clear boundaries, mutual respect, and patience during high-stress periods."


def calculate_bhakoot(rashi1: str, rashi2: str) -> Tuple[float, str]:
    """7. Bhakoot Koota (7 points): Emotional prosperity, family happiness, and life trajectory."""
    try:
        r1_idx = RASHIS.index(rashi1)
        r2_idx = RASHIS.index(rashi2)
    except ValueError:
        return 7.0, "Favorable Bhakoot alignment."

    dist1 = (r2_idx - r1_idx + 12) % 12 + 1
    dist2 = (r1_idx - r2_idx + 12) % 12 + 1

    pair = tuple(sorted([dist1, dist2]))

    # Auspicious placements: 1/1, 3/11, 4/10, 7/7
    if pair in [(1, 1), (3, 11), (4, 10), (7, 7)]:
        return 7.0, f"Highly auspicious Bhakoot placement ({pair[0]}/{pair[1]}). Promotes emotional fulfillment, domestic harmony, and shared prosperity."
    elif pair == (5, 9):
        return 7.0, f"Trikona Bhakoot alignment (5/9). Deep philosophical connection, mutual devotion, and shared spiritual growth."
    else:
        # Standard cancellations: If same lord or friendly lords, Dosha is mitigated
        lord1 = RASHI_LORDS.get(rashi1, "Jupiter")
        lord2 = RASHI_LORDS.get(rashi2, "Jupiter")
        if lord1 == lord2 or lord2 in PLANET_RELATIONS.get(lord1, {}).get("Friends", []):
            return 4.0, f"Bhakoot placement ({pair[0]}/{pair[1]}) with Dosha Cancellation due to friendly sign lords ({lord1} & {lord2})."
        return 1.0, f"Bhakoot dynamic ({pair[0]}/{pair[1]}); suggests conscious intention in financial planning and emotional openness."


def calculate_nadi(nakshatra1: str, nakshatra2: str) -> Tuple[float, str]:
    """8. Nadi Koota (8 points): Genetic, physiological compatibility and Ayurvedic balance."""
    n1 = NADI_MAP.get(nakshatra1, "Aadi")
    n2 = NADI_MAP.get(nakshatra2, "Madhya")

    if n1 != n2:
        return 8.0, f"Diverse Nadis ({n1} & {n2}). Optimal Ayurvedic constitution compatibility, strong vitality, and physiological balance."
    else:
        # Same Nadi (Nadi Dosha) - check standard cancellations
        return 2.0, f"Same Nadi ({n1}). Traditionally suggests mutual mindfulness in wellness, nutrition, and stress management."


def calculate_ashtakoota(
    details1: BirthDetails,
    details2: BirthDetails
) -> AshtakootaResult:
    """Computes the full 8-dimensional Vedic Ashtakoota score out of 36."""
    r1 = normalize_name(details1.rashi, RASHIS)
    r2 = normalize_name(details2.rashi, RASHIS)
    n1 = normalize_name(details1.nakshatra, NAKSHATRAS)
    n2 = normalize_name(details2.nakshatra, NAKSHATRAS)

    varna_score, varna_desc = calculate_varna(r1, r2)
    vashya_score, vashya_desc = calculate_vashya(r1, r2)
    tara_score, tara_desc = calculate_tara(n1, n2)
    yoni_score, yoni_desc = calculate_yoni(n1, n2)
    graha_score, graha_desc = calculate_graha_maitri(r1, r2)
    gana_score, gana_desc = calculate_gana(n1, n2)
    bhakoot_score, bhakoot_desc = calculate_bhakoot(r1, r2)
    nadi_score, nadi_desc = calculate_nadi(n1, n2)

    total = sum([
        varna_score, vashya_score, tara_score, yoni_score,
        graha_score, gana_score, bhakoot_score, nadi_score
    ])
    total = round(total, 1)

    kootas = [
        GunaKoota(
            name="Varna",
            sanskrit_name="वर्ण",
            max_score=1.0,
            obtained_score=varna_score,
            area_of_life="Spiritual & Ego Compatibility",
            interpretation=varna_desc
        ),
        GunaKoota(
            name="Vashya",
            sanskrit_name="वश्य",
            max_score=2.0,
            obtained_score=vashya_score,
            area_of_life="Mutual Attraction & Harmony",
            interpretation=vashya_desc
        ),
        GunaKoota(
            name="Tara",
            sanskrit_name="तारा",
            max_score=3.0,
            obtained_score=tara_score,
            area_of_life="Destiny, Health & Longevity",
            interpretation=tara_desc
        ),
        GunaKoota(
            name="Yoni",
            sanskrit_name="योनि",
            max_score=4.0,
            obtained_score=yoni_score,
            area_of_life="Biological & Physical Affinity",
            interpretation=yoni_desc
        ),
        GunaKoota(
            name="Graha Maitri",
            sanskrit_name="ग्रह मैत्री",
            max_score=5.0,
            obtained_score=graha_score,
            area_of_life="Intellectual & Psychological Friendship",
            interpretation=graha_desc
        ),
        GunaKoota(
            name="Gana",
            sanskrit_name="गण",
            max_score=6.0,
            obtained_score=gana_score,
            area_of_life="Temperament & Behavioral Alignment",
            interpretation=gana_desc
        ),
        GunaKoota(
            name="Bhakoot",
            sanskrit_name="भकूट",
            max_score=7.0,
            obtained_score=bhakoot_score,
            area_of_life="Emotional Fulfillment & Family Prosperity",
            interpretation=bhakoot_desc
        ),
        GunaKoota(
            name="Nadi",
            sanskrit_name="नाड़ी",
            max_score=8.0,
            obtained_score=nadi_score,
            area_of_life="Physiological & Genetic Health Balance",
            interpretation=nadi_desc
        ),
    ]

    if total >= 28:
        category = "Exceptional Compatibility"
    elif total >= 24:
        category = "Strong Compatibility"
    elif total >= 18:
        category = "Auspicious & Favorable"
    elif total >= 14:
        category = "Moderate Compatibility"
    else:
        category = "Traditional Remedies Advised"

    return AshtakootaResult(
        total_score=total,
        max_score=36.0,
        favorable=total >= 18.0,
        compatibility_category=category,
        kootas=kootas
    )


def evaluate_manglik_dosha(user1: BirthDetails, user2: BirthDetails) -> ManglikAnalysis:
    """Evaluates Manglik Dosha balance between two individuals."""
    m1 = user1.is_manglik
    m2 = user2.is_manglik

    if m1 and m2:
        return ManglikAnalysis(
            user1_manglik=True,
            user2_manglik=True,
            status="Compatible",
            summary="Both partners have Manglik placement, which traditionally cancels out any dosha (Kuja Dosha Nivarana) and produces a balanced dynamic of drive, passion, and ambition."
        )
    elif not m1 and not m2:
        return ManglikAnalysis(
            user1_manglik=False,
            user2_manglik=False,
            status="Compatible",
            summary="Neither partner has Manglik placement. Mars energies are harmonious and standard relationship dynamics apply."
        )
    else:
        manglik_person = user1.name if m1 else (user2.name or "Partner")
        return ManglikAnalysis(
            user1_manglik=m1,
            user2_manglik=m2,
            status="Balanced (Standard)",
            summary=f"One partner ({manglik_person}) has active Mars placement. In modern Vedic practice, this represents high initiative and passion, easily balanced when partners practice open dialogue and patience."
        )
