import { supabase } from '../supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Failed to parse server response', response.status);
  }

  const apiData = data as { success?: boolean; message?: string; data?: unknown };

  if (!response.ok) {
    throw new ApiError(apiData.message || 'API request failed', response.status, apiData);
  }

  if (apiData.success !== undefined && !apiData.success) {
    throw new ApiError(apiData.message || 'API request failed', response.status, apiData);
  }

  return apiData.data !== undefined ? apiData.data : apiData;
}

export const apiClient = {
  get: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: unknown, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body: unknown, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string, options?: RequestInit) => fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
