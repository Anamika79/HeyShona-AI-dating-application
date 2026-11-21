import { apiClient } from './client';
import { HealthCheckResponse } from '../types/api';

export async function fetchHealth(): Promise<HealthCheckResponse> {
  return apiClient<HealthCheckResponse>('/api/v1/health');
}
