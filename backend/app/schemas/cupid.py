from typing import List, Optional
from pydantic import BaseModel, Field


class CupidAdviceRequest(BaseModel):
    user_name: str = Field("Anamika", description="Current user's name")
    match_name: str = Field(..., description="Match's name")
    match_bio: str = Field(..., description="Match's bio snippet")
    match_occupation: str = Field(..., description="Match's occupation")
    match_values: List[str] = Field(default_factory=list, description="Shared or match core values")
    match_interests: List[str] = Field(default_factory=list, description="Match interests and hobbies")
    match_communication: Optional[str] = Field(None, description="Match's preferred communication style")
    user_query: Optional[str] = Field(None, description="Specific question or dilemma for Cupid")


class CupidAdviceResponse(BaseModel):
    match_name: str
    cupid_vibe: str
    starters: List[str]
    topic_revivers: List[str]
    communication_tips: List[str]
    custom_reply: Optional[str] = None
