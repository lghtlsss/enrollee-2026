import { BACKEND_URL, TOKEN_KEY } from './constants';
import type {
  ApiError,
  Direction,
  Paginated,
  Profile,
  ProgramDetail,
  ProgramShort,
  RecommendationItem,
  RecommendationRequest,
  Review,
  Token,
  UniversityDetail,
  UniversityShort,
  User,
} from './types';

export const getToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class RequestError extends Error implements ApiError {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init.body && !(init.body instanceof URLSearchParams) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BACKEND_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    if (response.status === 401) clearToken();
    let detail = response.statusText || 'Ошибка запроса';
    try {
      const body = await response.json();
      if (typeof body?.detail === 'string') detail = body.detail;
    } catch {}
    throw new RequestError(response.status, detail);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const query = (params: Record<string, string | number | boolean | null | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const text = search.toString();
  return text ? `?${text}` : '';
};

export const api = {
  auth: {
    register: (data: { name: string; surname: string; email: string; password: string }) =>
      request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<Token>('/auth/login', {
        method: 'POST',
        body: new URLSearchParams({ username: data.email, password: data.password }),
      }),
    me: () => request<User>('/users/me'),
  },
  profile: {
    get: () => request<Profile>('/profile'),
    update: (data: Profile) =>
      request<Profile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  directions: {
    list: () => request<Direction[]>('/directions'),
  },
  universities: {
    list: (params: { skip?: number; limit?: number; city?: string; search?: string }) =>
      request<Paginated<UniversityShort>>(`/universities${query(params)}`),
    get: (id: number) => request<UniversityDetail>(`/universities/${id}`),
    reviews: (id: number) => request<Review[]>(`/universities/${id}/reviews`),
  },
  programs: {
    list: (params: { university_id?: number; direction_id?: number; limit?: number }) =>
      request<Paginated<ProgramShort>>(`/programs${query({ limit: 100, ...params })}`),
    get: (id: number) => request<ProgramDetail>(`/programs/${id}`),
  },
  recommendations: (data: RecommendationRequest) =>
    request<Paginated<RecommendationItem>>('/recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  favorites: {
    list: () => request<UniversityShort[]>('/favorites'),
    add: (universityId: number) =>
      request<UniversityShort[]>(`/favorites/${universityId}`, { method: 'POST' }),
    remove: (universityId: number) =>
      request<UniversityShort[]>(`/favorites/${universityId}`, { method: 'DELETE' }),
  },
};
