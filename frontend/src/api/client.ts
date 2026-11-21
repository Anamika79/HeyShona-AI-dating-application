import { ApiErrorResponse } from '../types/api';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:8000');

export class ApiError extends Error {
  public code: string;
  public details?: unknown;
  public status: number;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorBody: ApiErrorResponse | null = null;
      try {
        errorBody = (await response.json()) as ApiErrorResponse;
      } catch {
        // Response wasn't valid JSON
      }

      const code = errorBody?.error?.code || `HTTP_${response.status}`;
      const message = errorBody?.error?.message || response.statusText || 'An unexpected error occurred.';
      const details = errorBody?.error?.details;

      throw new ApiError(response.status, code, message, details);
    }

    return (await response.json()) as T;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or connection failure
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      err instanceof Error ? err.message : 'Unable to connect to the backend server. Please verify it is running.'
    );
  }
}
