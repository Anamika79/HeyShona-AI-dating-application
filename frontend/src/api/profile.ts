import { apiClient } from './client';
import { ProfileAnalysisRequest, ProfileIntelligenceResponse } from '../types/profile';

/**
 * Sends profile text to FastAPI backend for AI Profile Intelligence analysis.
 */
export async function analyzeProfile(
  payload: ProfileAnalysisRequest
): Promise<ProfileIntelligenceResponse> {
  return apiClient<ProfileIntelligenceResponse>('/api/v1/profile-intelligence/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
