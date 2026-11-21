from typing import List, Optional
from pydantic import BaseModel, Field, field_validator


class PersonalityInsight(BaseModel):
    trait: str = Field(..., description="Observed behavioral or psychological trait")
    evidence: str = Field(..., description="Exact or near-exact quote/evidence from the profile text")
    confidence: Optional[str] = Field(default="explicit", description="'explicit' or 'inferred'")


class CoreValue(BaseModel):
    value: str = Field(..., description="Identified core value or personal principle")
    evidence: str = Field(..., description="Supporting excerpt from profile text")
    is_explicit: bool = Field(default=True, description="Whether explicitly stated by user")


class Interest(BaseModel):
    interest: str = Field(..., description="Topic, hobby, or lifestyle passion")
    category: Optional[str] = Field(default=None, description="Optional classification (e.g. sports, tech, arts)")
    evidence: str = Field(..., description="Supporting excerpt from profile text")


class RelationshipExpectation(BaseModel):
    expectation: str = Field(..., description="Partner or relationship expectation/intention")
    evidence: str = Field(..., description="Supporting excerpt from profile text")


class CommunicationPreference(BaseModel):
    preference: str = Field(..., description="Preferred communication style, medium, or cadence")
    evidence: str = Field(..., description="Supporting excerpt from profile text")


class PersonalBoundary(BaseModel):
    boundary: str = Field(..., description="Expressed limit, boundary, or dealbreaker")
    evidence: str = Field(..., description="Supporting excerpt from profile text")


class MissingInformation(BaseModel):
    unknown_aspects: List[str] = Field(
        default_factory=list,
        description="Key relationship/personality dimensions not addressed in profile text",
    )
    recommended_follow_up_questions: List[str] = Field(
        default_factory=list,
        description="Thoughtful, non-intrusive questions to invite deeper profile completion",
    )


class ProfileIntelligenceData(BaseModel):
    personality_insights: List[PersonalityInsight] = Field(default_factory=list)
    core_values: List[CoreValue] = Field(default_factory=list)
    interests_and_lifestyle: List[Interest] = Field(default_factory=list)
    relationship_expectations: List[RelationshipExpectation] = Field(default_factory=list)
    communication_preferences: List[CommunicationPreference] = Field(default_factory=list)
    personal_boundaries: List[PersonalBoundary] = Field(default_factory=list)
    missing_information: MissingInformation = Field(default_factory=MissingInformation)


class ProfileIntelligenceResponse(BaseModel):
    response: ProfileIntelligenceData = Field(..., description="Validated extracted profile intelligence")


class ProfileAnalysisRequest(BaseModel):
    profile_text: str = Field(
        ...,
        description="Raw user-submitted profile description text",
    )

    @field_validator("profile_text")
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Profile text cannot be empty or contain solely whitespace.")
        return v.strip()
