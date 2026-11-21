import {
  ChatMetricsRequest,
  ChatMetricsResponse,
  ChatConsentState,
} from '../types/chatMetrics';
import { API_BASE_URL } from './client';

export async function fetchChatMetrics(
  payload: ChatMetricsRequest
): Promise<ChatMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat-metrics/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Server responded with status ${response.status}`
    );
  }

  return response.json();
}

export async function fetchConsentStatus(
  connectionId: string
): Promise<ChatConsentState> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat-metrics/consent/${connectionId}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to fetch consent status (${response.status})`
    );
  }

  return response.json();
}

export async function updateConsentStatus(
  connectionId: string,
  userConsented?: boolean,
  partnerConsented?: boolean
): Promise<ChatConsentState> {
  const params = new URLSearchParams();
  params.append('connection_id', connectionId);
  if (userConsented !== undefined) {
    params.append('user_consented', String(userConsented));
  }
  if (partnerConsented !== undefined) {
    params.append('partner_consented', String(partnerConsented));
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat-metrics/consent?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to update consent status (${response.status})`
    );
  }

  return response.json();
}

export async function deleteConnectionInsights(
  connectionId: string
): Promise<{ status: string; message: string }> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/chat-metrics/insights/${connectionId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to delete insights (${response.status})`
    );
  }

  return response.json();
}
