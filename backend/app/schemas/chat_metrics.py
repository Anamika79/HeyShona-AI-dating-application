from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ChatMessageInput(BaseModel):
    id: Optional[str] = None
    sender: str = Field(..., description="'user' or 'match'")
    text: str = Field(..., description="Message text content")
    timestamp: Optional[str] = Field("Just now", description="Human-readable or ISO timestamp")


class ChatMetricsRequest(BaseModel):
    connection_id: str = Field(..., description="ID of the connection")
    user_name: str = Field("Anamika", description="Current user's display name")
    match_name: str = Field(..., description="Match's display name")
    messages: List[ChatMessageInput] = Field(default_factory=list, description="Chat messages to analyze")
    timeframe: str = Field("7d", description="Timeframe filter: '7d', '30d', or 'all'")
    user_consented: bool = Field(True, description="Whether current user has enabled Chat Metrics")
    partner_consented: bool = Field(True, description="Whether partner has enabled Chat Metrics")


class MomentumPoint(BaseModel):
    date: str
    user_messages: int
    match_messages: int
    total: int


class ConversationMomentum(BaseModel):
    data_points: List[MomentumPoint]
    trend_label: str
    trend_description: str
    cadence_note: str


class CommunicationBalance(BaseModel):
    user_count: int
    match_count: int
    total: int
    user_pct: float
    match_pct: float
    user_avg_words: float
    match_avg_words: float
    balance_status: str
    balance_insight: str


class EngagementIndicator(BaseModel):
    title: str
    frequency: str
    evidence: str
    icon: str = "✨"


class EmotionalEngagement(BaseModel):
    indicators: List[EngagementIndicator]
    summary_note: str


class ConversationDepth(BaseModel):
    current_level: int = Field(..., ge=1, le=5)
    current_title: str
    depth_description: str
    topics_explored: List[str]
    progression: List[Dict[str, Any]]


class CommunicationPatterns(BaseModel):
    message_length_style: str
    peak_hours: str
    question_reciprocity: str
    common_topics: List[str]
    observation_summary: str


class WeeklyConnectionSummary(BaseModel):
    headline: str
    summary: str
    whats_working: List[str]
    opportunity_to_connect: str
    ai_conversation_suggestion: str


class DeeperConversationStarter(BaseModel):
    question: str
    theme: str
    why_it_connects: str


class ChatConsentState(BaseModel):
    connection_id: str
    user_consented: bool
    partner_consented: bool
    is_mutual_consent: bool
    consent_description: str
    can_revoke: bool = True


class ChatMetricsResponse(BaseModel):
    connection_id: str
    is_mutual_consent: bool
    user_consented: bool
    partner_consented: bool
    has_sufficient_data: bool
    message_count: int
    timeframe: str
    momentum: Optional[ConversationMomentum] = None
    balance: Optional[CommunicationBalance] = None
    engagement: Optional[EmotionalEngagement] = None
    depth: Optional[ConversationDepth] = None
    patterns: Optional[CommunicationPatterns] = None
    weekly_summary: Optional[WeeklyConnectionSummary] = None
    deeper_starters: List[DeeperConversationStarter] = Field(default_factory=list)
    ethical_disclaimer: str = (
        "Connection Intelligence analyzes communication patterns to support deeper mutual understanding. "
        "It does not measure psychological compatibility, diagnose emotions, or judge relationship viability."
    )
