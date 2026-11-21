export interface ChatMessageInput {
  id?: string;
  sender: string;
  text: string;
  timestamp?: string;
}

export interface MomentumPoint {
  date: string;
  user_messages: intNumber;
  match_messages: intNumber;
  total: intNumber;
}

type intNumber = number;

export interface ConversationMomentum {
  data_points: MomentumPoint[];
  trend_label: string;
  trend_description: string;
  cadence_note: string;
}

export interface CommunicationBalance {
  user_count: number;
  match_count: number;
  total: number;
  user_pct: number;
  match_pct: number;
  user_avg_words: number;
  match_avg_words: number;
  balance_status: string;
  balance_insight: string;
}

export interface EngagementIndicator {
  title: string;
  frequency: string;
  evidence: string;
  icon?: string;
}

export interface EmotionalEngagement {
  indicators: EngagementIndicator[];
  summary_note: string;
}

export interface ProgressionLevel {
  level: number;
  title: string;
  description: string;
}

export interface ConversationDepth {
  current_level: number;
  current_title: string;
  depth_description: string;
  topics_explored: string[];
  progression: ProgressionLevel[];
}

export interface CommunicationPatterns {
  message_length_style: string;
  peak_hours: string;
  question_reciprocity: string;
  common_topics: string[];
  observation_summary: string;
}

export interface WeeklyConnectionSummary {
  headline: string;
  summary: string;
  whats_working: string[];
  opportunity_to_connect: string;
  ai_conversation_suggestion: string;
}

export interface DeeperConversationStarter {
  question: string;
  theme: string;
  why_it_connects: string;
}

export interface ChatConsentState {
  connection_id: string;
  user_consented: boolean;
  partner_consented: boolean;
  is_mutual_consent: boolean;
  consent_description: string;
  can_revoke: boolean;
}

export interface ChatMetricsRequest {
  connection_id: string;
  user_name: string;
  match_name: string;
  messages: ChatMessageInput[];
  timeframe: string;
  user_consented: boolean;
  partner_consented: boolean;
}

export interface ChatMetricsResponse {
  connection_id: string;
  is_mutual_consent: boolean;
  user_consented: boolean;
  partner_consented: boolean;
  has_sufficient_data: boolean;
  message_count: number;
  timeframe: string;
  momentum?: ConversationMomentum;
  balance?: CommunicationBalance;
  engagement?: EmotionalEngagement;
  depth?: ConversationDepth;
  patterns?: CommunicationPatterns;
  weekly_summary?: WeeklyConnectionSummary;
  deeper_starters: DeeperConversationStarter[];
  ethical_disclaimer: string;
}
