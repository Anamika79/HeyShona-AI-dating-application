import { apiClient } from './client';

export interface CupidAdviceRequest {
  user_name: string;
  match_name: string;
  match_bio: string;
  match_occupation: string;
  match_values?: string[];
  match_interests?: string[];
  match_communication?: string;
  user_query?: string;
}

export interface CupidAdviceResponse {
  match_name: string;
  cupid_vibe: string;
  starters: string[];
  topic_revivers: string[];
  communication_tips: string[];
  custom_reply?: string;
}

export async function fetchCupidAdvice(payload: CupidAdviceRequest): Promise<CupidAdviceResponse> {
  return apiClient<CupidAdviceResponse>('/api/v1/cupid/advice', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
