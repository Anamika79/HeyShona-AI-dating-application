from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class DatePreferenceProfile(BaseModel):
    user_id: str
    user_name: str
    food_preferences: List[str] = Field(default_factory=list, description="e.g. Specialty coffee, Italian, Plant-forward")
    favorite_activities: List[str] = Field(default_factory=list, description="e.g. Gallery walks, live music, trail runs")
    disliked_activities: List[str] = Field(default_factory=list, description="e.g. Loud nightclubs, crowded malls")
    environment_preference: str = Field("Balanced indoor & quiet outdoor", description="Indoor, outdoor, or balanced")
    vibe_preference: str = Field("Relaxed & Meaningful", description="e.g. Romantic, Relaxed, Cultural, Adventurous")
    budget_preference: str = Field("Moderate", description="Budget-friendly, Moderate, Premium")
    accessibility_notes: Optional[str] = None
    preferred_locations: List[str] = Field(default_factory=list, description="e.g. Quiet neighborhood cafes, parks, art districts")


class DatePlanningRequest(BaseModel):
    connection_id: str
    user_name: str = "Anamika"
    match_name: str
    match_profile: Optional[Dict[str, Any]] = None
    user_preferences: Optional[DatePreferenceProfile] = None
    match_preferences: Optional[DatePreferenceProfile] = None
    city: str = Field("Bengaluru, India", description="Target city for the date")
    preferred_date: str = Field("Upcoming Weekend", description="e.g. Saturday Evening, Sunday Morning")
    preferred_time_of_day: str = Field("Late Afternoon & Evening", description="Morning, Afternoon, Evening, Night")
    budget_range: str = Field("Moderate (₹1,500 - ₹3,000)", description="Budget bracket")
    date_type: str = Field("Creative & Relaxed", description="Romantic, Casual, Adventure, Food & Culinary, Creative & Art, Relaxed, Cultural")
    additional_notes: Optional[str] = Field(None, description="Custom prompt, e.g. celebrating a marathon milestone")


class ItineraryItem(BaseModel):
    step_number: int
    time_slot: str
    activity_name: str
    description: str
    location_type: str
    indoor_outdoor: str
    estimated_cost: str


class DateConcept(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    why_it_suits_both: str
    date_type: str
    indoor_outdoor: str
    estimated_duration: str
    estimated_total_cost: str
    suggested_activities: List[str]
    things_to_consider: List[str]
    itinerary: List[ItineraryItem]
    alternative_options: str
    travel_tips: str


class DatePlanResponse(BaseModel):
    connection_id: str
    user_name: str
    match_name: str
    city: str
    date_type: str
    budget_range: str
    concepts: List[DateConcept]
    personalized_synergy_summary: str
    created_at: str = "Just now"
