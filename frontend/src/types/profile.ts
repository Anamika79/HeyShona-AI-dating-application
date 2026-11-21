export interface PersonalityInsight {
  trait: string;
  evidence: string;
  confidence?: 'explicit' | 'inferred';
}

export interface CoreValue {
  value: string;
  evidence: string;
  is_explicit: boolean;
}

export interface Interest {
  interest: string;
  category?: string;
  evidence: string;
}

export interface RelationshipExpectation {
  expectation: string;
  evidence: string;
}

export interface CommunicationPreference {
  preference: string;
  evidence: string;
}

export interface PersonalBoundary {
  boundary: string;
  evidence: string;
}

export interface MissingInformation {
  unknown_aspects: string[];
  recommended_follow_up_questions: string[];
}

export interface ProfileIntelligenceData {
  personality_insights: PersonalityInsight[];
  core_values: CoreValue[];
  interests_and_lifestyle: Interest[];
  relationship_expectations: RelationshipExpectation[];
  communication_preferences: CommunicationPreference[];
  personal_boundaries: PersonalBoundary[];
  missing_information: MissingInformation;
}

export interface ProfileIntelligenceResponse {
  response: ProfileIntelligenceData;
}

export interface ProfileAnalysisRequest {
  profile_text: string;
}

export type GenderType = 'Female' | 'Male' | 'LGBTQ+';
export type LookingForType = 'Female' | 'Male' | 'LGBTQ+' | 'Everyone';

export interface BasicProfile {
  name: string;
  age: number;
  gender: GenderType;
  location: string;
  job: string;
  looking_for: LookingForType;
  bio: string;
  avatar_url?: string;
}
