export interface PlanetaryPosition {
  planet: string;
  rashi: string;
  house: number;
  degree?: string;
}

export interface BirthDetails {
  name?: string;
  date_of_birth: string;
  time_of_birth?: string;
  place_of_birth?: string;
  rashi: string;
  nakshatra: string;
  lagna?: string;
  is_manglik: boolean;
  manglik_note?: string;
  planetary_positions?: PlanetaryPosition[];
}

export interface GunaKoota {
  name: string;
  sanskrit_name: string;
  max_score: number;
  obtained_score: number;
  area_of_life: string;
  interpretation: string;
}

export interface AshtakootaResult {
  total_score: number;
  max_score: number;
  favorable: boolean;
  compatibility_category: string;
  kootas: GunaKoota[];
}

export interface ManglikAnalysis {
  user1_manglik: boolean;
  user2_manglik: boolean;
  status: string;
  summary: string;
}

export interface HoroscopeProfile {
  user_id: string;
  has_horoscope: boolean;
  birth_details?: BirthDetails;
  is_visible_for_matching: boolean;
  uploaded_document_name?: string;
  analysis_status: string;
  updated_at?: string;
}

export interface HoroscopeMatchCard {
  candidate_id: string;
  candidate_name: string;
  age: number;
  occupation: string;
  location: string;
  avatar_url: string;
  rashi: string;
  nakshatra: string;
  lagna?: string;
  is_manglik: boolean;
  guna_score: number;
  max_score: number;
  compatibility_tier: string;
  synergy_highlight: string;
  manglik_compatible: boolean;
}

export interface HoroscopeReportResponse {
  user1_name: string;
  user2_name: string;
  user1_rashi: string;
  user1_nakshatra: string;
  user2_rashi: string;
  user2_nakshatra: string;
  ashtakoota: AshtakootaResult;
  manglik_analysis: ManglikAnalysis;
  vedic_summary: string;
  astrological_strengths: string[];
  growth_areas: string[];
  disclaimer: string;
}

export interface ExtractHoroscopeResponse {
  extracted_details: BirthDetails;
  confidence_score: number;
  notes: string[];
  raw_detected_elements: Record<string, unknown>;
}
