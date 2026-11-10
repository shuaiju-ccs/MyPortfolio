
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function apiRequest<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error(`Cannot reach the server at ${API_URL}. Is the backend running?`);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${response.status})`);
  }
  return data as T;
}

export type Role = 'user' | 'admin';

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: Role;
};

export type SigninResponse = { token: string; user: AuthUser };

export type PortfolioRecord = {
  _id: string;
  title: string;
  firstname: string;
  lastname: string;
  email: string;
  completion: string;
  description?: string;
};

export type ContactRecord = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  message?: string;
  preferredContactMethod?: 'email' | 'phone' | 'either';
  referralSource?: string;
  subscribeToUpdates?: boolean;
  created?: string;
};