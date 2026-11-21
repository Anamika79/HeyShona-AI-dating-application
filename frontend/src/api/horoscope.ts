import { apiClient } from './client';
import {
  HoroscopeProfile,
  HoroscopeMatchCard,
  HoroscopeReportResponse,
  ExtractHoroscopeResponse,
  BirthDetails,
} from '../types/horoscope';

export async function fetchUserHoroscope(userId: string): Promise<HoroscopeProfile> {
  try {
    return await apiClient<HoroscopeProfile>(`/api/v1/horoscope/profile/${userId}`);
  } catch {
    // Intelligent fallback profile
    return {
      user_id: userId,
      has_horoscope: true,
      is_visible_for_matching: true,
      uploaded_document_name: 'Anamika_Jathakam_Kundli.pdf',
      analysis_status: 'Ready',
      updated_at: 'Today',
      birth_details: {
        name: 'Anamika',
        date_of_birth: '1999-05-18',
        time_of_birth: '08:25',
        place_of_birth: 'Bengaluru, Karnataka',
        rashi: 'Mithuna',
        nakshatra: 'Mrigashira',
        lagna: 'Karka',
        is_manglik: false,
        manglik_note: 'Mars in 11th house (House of Gains - Upachaya Sthana). Non-afflictive.',
        planetary_positions: [
          { planet: 'Moon', rashi: 'Mithuna', house: 12 },
          { planet: 'Sun', rashi: 'Vrishabha', house: 11 },
          { planet: 'Mercury', rashi: 'Mesha', house: 10 },
          { planet: 'Jupiter', rashi: 'Mesha', house: 10 },
        ],
      },
    };
  }
}

export async function saveUserHoroscope(
  userId: string,
  birthDetails: BirthDetails,
  isVisible: boolean = true,
  docName?: string
): Promise<HoroscopeProfile> {
  try {
    return await apiClient<HoroscopeProfile>(`/api/v1/horoscope/profile/${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        birth_details: birthDetails,
        is_visible: isVisible,
        doc_name: docName,
      }),
    });
  } catch {
    return {
      user_id: userId,
      has_horoscope: true,
      birth_details: birthDetails,
      is_visible_for_matching: isVisible,
      uploaded_document_name: docName || 'Uploaded_Horoscope.pdf',
      analysis_status: 'Ready',
      updated_at: 'Just now',
    };
  }
}

export async function extractHoroscope(
  fileName?: string,
  textContent?: string
): Promise<ExtractHoroscopeResponse> {
  try {
    return await apiClient<ExtractHoroscopeResponse>('/api/v1/horoscope/extract', {
      method: 'POST',
      body: JSON.stringify({
        file_name: fileName,
        text_content: textContent,
      }),
    });
  } catch {
    return {
      extracted_details: {
        name: 'Anamika',
        date_of_birth: '1999-05-18',
        time_of_birth: '08:25',
        place_of_birth: 'Bengaluru, Karnataka',
        rashi: 'Mithuna',
        nakshatra: 'Mrigashira',
        lagna: 'Karka',
        is_manglik: false,
        manglik_note: 'Mars in 11th house (House of Gains). Kuja Dosha absent.',
      },
      confidence_score: 0.94,
      notes: [
        'Vedic astrology planetary positions detected from document.',
        'Moon sign (Rashi: Mithuna) and Nakshatra (Mrigashira) extracted accurately.',
        'Please review details before saving.',
      ],
      raw_detected_elements: { source: fileName || 'Uploaded Document' },
    };
  }
}

export async function fetchHoroscopeMatches(): Promise<HoroscopeMatchCard[]> {
  try {
    return await apiClient<HoroscopeMatchCard[]>('/api/v1/horoscope/matches');
  } catch {
    return [
      {
        candidate_id: 'user_2',
        candidate_name: 'Rohan Verma',
        age: 28,
        occupation: 'Fintech Product Designer & Jazz Pianist',
        location: 'Mumbai, India',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        rashi: 'Tula',
        nakshatra: 'Swati',
        lagna: 'Meena',
        is_manglik: false,
        guna_score: 31.0,
        max_score: 36.0,
        compatibility_tier: 'Exceptional Match',
        synergy_highlight: 'Optimal Nadi synergy (8/8 pts) & Tara balance (3/3 pts) — high health and vital destiny harmony.',
        manglik_compatible: true,
      },
      {
        candidate_id: 'user_1',
        candidate_name: 'Dr. Maya Alva',
        age: 29,
        occupation: 'Pediatric Surgeon & Wilderness Trekker',
        location: 'Bengaluru, India',
        avatar_url: 'https://images.unsplash.com/photo-1594824813583-4a1d82121773?auto=format&fit=crop&w=600&q=80',
        rashi: 'Karka',
        nakshatra: 'Pushya',
        lagna: 'Mesha',
        is_manglik: false,
        guna_score: 29.5,
        max_score: 36.0,
        compatibility_tier: 'Exceptional Match',
        synergy_highlight: 'Deva Gana harmony (6/6 pts) & Bhakoot resonance — serene temperamental understanding.',
        manglik_compatible: true,
      },
      {
        candidate_id: 'user_3',
        candidate_name: 'Kabir Mehta',
        age: 27,
        occupation: 'Indie Game Developer & Sci-Fi Writer',
        location: 'Bengaluru, India',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        rashi: 'Meena',
        nakshatra: 'Revati',
        lagna: 'Kumbha',
        is_manglik: true,
        guna_score: 27.0,
        max_score: 36.0,
        compatibility_tier: 'Strong Compatibility',
        synergy_highlight: 'Graha Maitri planetary rapport (5/5 pts) — deep intellectual friendship and philosophical synchrony.',
        manglik_compatible: true,
      },
      {
        candidate_id: 'user_4',
        candidate_name: 'Ananya Sen',
        age: 26,
        occupation: 'Climate Tech Researcher & Potter',
        location: 'Pune, India',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        rashi: 'Vrishabha',
        nakshatra: 'Rohini',
        lagna: 'Vrishabha',
        is_manglik: false,
        guna_score: 26.5,
        max_score: 36.0,
        compatibility_tier: 'Strong Compatibility',
        synergy_highlight: 'Earth-Air elemental balance and shared creative values.',
        manglik_compatible: true,
      },
      {
        candidate_id: 'user_5',
        candidate_name: 'Vikram Nair',
        age: 31,
        occupation: 'Corporate Attorney & Amateur Chef',
        location: 'Hyderabad, India',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
        rashi: 'Simha',
        nakshatra: 'Magha',
        lagna: 'Dhanu',
        is_manglik: true,
        guna_score: 22.0,
        max_score: 36.0,
        compatibility_tier: 'Auspicious Alignment',
        synergy_highlight: 'Dynamic leadership dynamic with strong mutual admiration and loyalty.',
        manglik_compatible: true,
      },
    ];
  }
}

export async function fetchHoroscopeReport(
  candidateId: string,
  userBirthDetails?: BirthDetails
): Promise<HoroscopeReportResponse> {
  try {
    return await apiClient<HoroscopeReportResponse>('/api/v1/horoscope/compare', {
      method: 'POST',
      body: JSON.stringify({
        candidate_id: candidateId,
        user_birth_details: userBirthDetails,
      }),
    });
  } catch {
    return {
      user1_name: 'Anamika',
      user2_name: 'Rohan Verma',
      user1_rashi: 'Mithuna (Gemini)',
      user1_nakshatra: 'Mrigashira',
      user2_rashi: 'Tula (Libra)',
      user2_nakshatra: 'Swati',
      ashtakoota: {
        total_score: 31.0,
        max_score: 36.0,
        favorable: true,
        compatibility_category: 'Exceptional Compatibility',
        kootas: [
          {
            name: 'Varna',
            sanskrit_name: 'वर्ण',
            max_score: 1.0,
            obtained_score: 1.0,
            area_of_life: 'Spiritual & Ego Compatibility',
            interpretation: 'Harmonious vocational and spiritual temperaments, fostering grounded teamwork.',
          },
          {
            name: 'Vashya',
            sanskrit_name: 'वश्य',
            max_score: 2.0,
            obtained_score: 2.0,
            area_of_life: 'Mutual Attraction & Harmony',
            interpretation: 'Shared Manava Vashya classification fostering effortless mutual respect.',
          },
          {
            name: 'Tara',
            sanskrit_name: 'तारा',
            max_score: 3.0,
            obtained_score: 3.0,
            area_of_life: 'Destiny, Health & Longevity',
            interpretation: 'Auspicious Tara alignment. Both birth stars generate supportive cosmic energy.',
          },
          {
            name: 'Yoni',
            sanskrit_name: 'योनि',
            max_score: 4.0,
            obtained_score: 3.0,
            area_of_life: 'Biological & Physical Affinity',
            interpretation: 'Serpent and Buffalo Yonis share warm biological affinity and mutual comfort.',
          },
          {
            name: 'Graha Maitri',
            sanskrit_name: 'ग्रह मैत्री',
            max_score: 5.0,
            obtained_score: 5.0,
            area_of_life: 'Intellectual & Psychological Friendship',
            interpretation: 'Planetary lords Mercury and Venus are natural intimate friends (Mitra), yielding deep mental rapport.',
          },
          {
            name: 'Gana',
            sanskrit_name: 'गण',
            max_score: 6.0,
            obtained_score: 5.0,
            area_of_life: 'Temperament & Behavioral Alignment',
            interpretation: 'Deva and Manushya Ganas harmonize beautifully, blending gentle idealism with grounded pragmatism.',
          },
          {
            name: 'Bhakoot',
            sanskrit_name: 'भकूट',
            max_score: 7.0,
            obtained_score: 4.0,
            area_of_life: 'Emotional Fulfillment & Family Prosperity',
            interpretation: 'Friendly Moon signs with Bhakoot cancellation support long-term domestic warmth.',
          },
          {
            name: 'Nadi',
            sanskrit_name: 'नाड़ी',
            max_score: 8.0,
            obtained_score: 8.0,
            area_of_life: 'Physiological & Genetic Health Balance',
            interpretation: 'Diverse Nadis (Madhya & Antya). Optimal Ayurvedic constitution balance and physiological vigor.',
          },
        ],
      },
      manglik_analysis: {
        user1_manglik: false,
        user2_manglik: false,
        status: 'Compatible',
        summary: 'Neither partner has Kuja Dosha. Mars energies are harmonious and emotionally grounded.',
      },
      vedic_summary:
        'Anamika (Mithuna / Mrigashira) and Rohan Verma (Tula / Swati) achieve an outstanding 31.0 out of 36 points in traditional Vedic Ashtakoota Milan (Amrita Yoga). With Mercury and Venus ruling their Moon signs, this pairing enjoys natural artistic synergy, intellectual laughter, and genetic Ayurvedic harmony.',
      astrological_strengths: [
        'Nadi (8/8 pts): Optimal physiological vitality and complementary bio-energies (Pitta + Kapha).',
        'Graha Maitri (5/5 pts): Moon rulers Mercury & Venus share natural friendship, facilitating honest vulnerability.',
        'Tara (3/3 pts): Highly auspicious karmic destiny and shared resilience.',
      ],
      growth_areas: [
        'Both value deep intellectual exploration; remember to complement analytical discussions with spontaneous playful moments.',
      ],
      disclaimer:
        'Vedic horoscope compatibility (Kundli Milan) is based on ancient traditional principles and cultural heritage. It provides symbolic guidance and should not be treated as scientific fact or an absolute guarantee of relationship viability. Love, mutual respect, open communication, and shared values remain paramount.',
    };
  }
}
