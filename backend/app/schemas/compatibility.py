from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.profile_intelligence import ProfileIntelligenceData


class UserProfileSummary(BaseModel):
    id: str = Field(..., description="Unique profile identifier")
    name: str = Field(..., description="User's display name")
    age: int = Field(..., description="User's age")
    gender: Optional[str] = Field("Female", description="Gender identity (Male, Female, LGBTQ+)")
    occupation: str = Field(..., description="Job or profession")
    location: str = Field(..., description="City and country/state")
    avatar_url: str = Field(..., description="Image URL for profile picture")
    bio: str = Field(..., description="Short user bio")
    profile_data: ProfileIntelligenceData = Field(..., description="Structured AI profile dimensions")


class DimensionScore(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Dimension score out of 100")
    weight: float = Field(..., description="Weight factor for this dimension")
    explanation: Optional[str] = Field(None, description="Brief rationale for this dimension score")


class CompatibilityBreakdown(BaseModel):
    core_values: DimensionScore = Field(..., description="Core Values alignment (30% weight)")
    relationship_expectations: DimensionScore = Field(..., description="Relationship Expectations (25% weight)")
    communication_style: DimensionScore = Field(..., description="Communication Preferences (20% weight)")
    lifestyle_and_interests: DimensionScore = Field(..., description="Lifestyle and Interests (15% weight)")
    personal_boundaries: DimensionScore = Field(..., description="Personal Boundaries compatibility (10% weight)")


class CompatibilityAnalysisRequest(BaseModel):
    user_a_profile: UserProfileSummary = Field(..., description="Current user's profile summary")
    user_b_profile: UserProfileSummary = Field(..., description="Candidate user's profile summary")


class CompatibilityReport(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall weighted compatibility score (0-100)")
    headline: str = Field(..., description="One-sentence headline summary of compatibility")
    overall_explanation: str = Field(..., description="AI-generated contextual explanation of overall compatibility")
    breakdown: CompatibilityBreakdown = Field(..., description="Dimension-by-dimension breakdown")
    why_you_might_connect: List[str] = Field(..., min_length=1, description="3-4 personalized connection reasons")
    potential_differences: List[str] = Field(..., min_length=1, description="2-3 constructive differences to explore")
    conversation_starters: List[str] = Field(..., min_length=1, description="3 thoughtful conversation starter questions")


class CandidateCompatibilityCard(BaseModel):
    profile: UserProfileSummary
    compatibility_score: int
    compatibility_headline: str
