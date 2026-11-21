import {
  DatePreferenceProfile,
  DatePlanningRequest,
  DatePlanResponse,
} from '../types/datePlanner';
import { API_BASE_URL } from './client';

export async function fetchDatePreferences(
  userId: string,
  defaultName: string = 'User'
): Promise<DatePreferenceProfile> {
  const params = new URLSearchParams({ default_name: defaultName });
  const response = await fetch(
    `${API_BASE_URL}/api/v1/date-planner/preferences/${userId}?${params.toString()}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to fetch date preferences (${response.status})`
    );
  }

  return response.json();
}

export async function saveDatePreferences(
  userId: string,
  preferences: DatePreferenceProfile
): Promise<DatePreferenceProfile> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/date-planner/preferences/${userId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to save date preferences (${response.status})`
    );
  }

  return response.json();
}

export async function generateDatePlan(
  payload: DatePlanningRequest
): Promise<DatePlanResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/date-planner/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to generate date recommendations (${response.status})`
    );
  }

  return response.json();
}
