import { ProfileIntelligenceData } from './profile';

export interface UserProfileSummary {
  id: string;
  name: string;
  age: number;
  gender?: 'Female' | 'Male' | 'LGBTQ+' | string;
  occupation: string;
  location: string;
  avatar_url: string;
  bio: string;
  profile_data: ProfileIntelligenceData;
}

export interface CandidateCompatibilityCard {
  profile: UserProfileSummary;
  compatibility_score: number;
  compatibility_headline: string;
}

export interface DimensionScore {
  score: number;
  weight: number;
  explanation?: string;
}

export interface CompatibilityBreakdown {
  core_values: DimensionScore;
  relationship_expectations: DimensionScore;
  communication_style: DimensionScore;
  lifestyle_and_interests: DimensionScore;
  personal_boundaries: DimensionScore;
}

export interface CompatibilityReport {
  overall_score: number;
  headline: string;
  overall_explanation: string;
  breakdown: CompatibilityBreakdown;
  why_you_might_connect: string[];
  potential_differences: string[];
  conversation_starters: string[];
}

export interface CompatibilityAnalysisRequest {
  user_a_profile: UserProfileSummary;
  user_b_profile: UserProfileSummary;
}
