import { apiClient } from './client';
import {
  CandidateCompatibilityCard,
  CompatibilityAnalysisRequest,
  CompatibilityReport,
} from '../types/compatibility';

/**
 * Fetch discovery candidate profiles with calculated compatibility scores.
 * Optionally filtered by anonymous looking_for gender preference.
 */
export async function fetchCandidates(looking_for?: string): Promise<CandidateCompatibilityCard[]> {
  const query = looking_for ? `?looking_for=${encodeURIComponent(looking_for)}` : '';
  return apiClient<CandidateCompatibilityCard[]>(`/api/v1/compatibility/candidates${query}`, {
    method: 'GET',
  });
}

/**
 * Request detailed AI-powered compatibility breakdown between two profiles.
 */
export async function fetchCompatibilityReport(
  payload: CompatibilityAnalysisRequest
): Promise<CompatibilityReport> {
  return apiClient<CompatibilityReport>('/api/v1/compatibility/compare', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
