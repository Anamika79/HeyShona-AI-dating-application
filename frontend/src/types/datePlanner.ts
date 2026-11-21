export interface DatePreferenceProfile {
  user_id: string;
  user_name: string;
  food_preferences: string[];
  favorite_activities: string[];
  disliked_activities: string[];
  environment_preference: string;
  vibe_preference: string;
  budget_preference: string;
  accessibility_notes?: string | null;
  preferred_locations: string[];
}

export interface ItineraryItem {
  step_number: number;
  time_slot: string;
  activity_name: string;
  description: string;
  location_type: string;
  indoor_outdoor: string;
  estimated_cost: string;
}

export interface DateConcept {
  id: string;
  title: string;
  tagline: string;
  description: string;
  why_it_suits_both: string;
  date_type: string;
  indoor_outdoor: string;
  estimated_duration: string;
  estimated_total_cost: string;
  suggested_activities: string[];
  things_to_consider: string[];
  itinerary: ItineraryItem[];
  alternative_options: string;
  travel_tips: string;
}

export interface DatePlanningRequest {
  connection_id: string;
  user_name: string;
  match_name: string;
  match_profile?: any;
  user_preferences?: DatePreferenceProfile;
  match_preferences?: DatePreferenceProfile;
  city: string;
  preferred_date: string;
  preferred_time_of_day: string;
  budget_range: string;
  date_type: string;
  additional_notes?: string | null;
}

export interface DatePlanResponse {
  connection_id: string;
  user_name: string;
  match_name: string;
  city: string;
  date_type: string;
  budget_range: string;
  concepts: DateConcept[];
  personalized_synergy_summary: string;
  created_at: string;
}

export interface SavedDatePlan {
  id: string;
  matchId: string;
  matchName: string;
  matchAvatar: string;
  city: string;
  concept: DateConcept;
  savedAt: string;
}
