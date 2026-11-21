export interface DatabaseHealth {
  connected: boolean;
  dialect: string;
  error?: string | null;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded';
  service: string;
  version: string;
  environment: string;
  database: DatabaseHealth;
  timestamp: string;
}

export interface ApiErrorEnvelope {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiErrorEnvelope;
}
