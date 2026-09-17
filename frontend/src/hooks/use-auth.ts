'use client';

import { api, clearToken, getToken, setToken } from '@/src/utils/api';
import type { Profile, RecommendationRequest, UniversityShort } from '@/src/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useRegister = () =>
  useMutation({
    mutationFn: (data: { name: string; surname: string; email: string; password: string }) =>
      api.auth.register(data),
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const token = await api.auth.login(data);
      setToken(token.access_token);
      return api.auth.me();
    },
    onSuccess: user => queryClient.setQueryData(['user'], user),
  });
};

export const useUser = () => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => (getToken() ? api.auth.me() : null),
    staleTime: Infinity,
    retry: false,
  });
  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    isAuthenticated: Boolean(query.data),
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    queryClient.setQueryData(['user'], null);
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.removeQueries({ queryKey: ['profile'] });
  };
};

export const useProfile = (enabled: boolean) =>
  useQuery({ queryKey: ['profile'], queryFn: api.profile.get, enabled, retry: false });

export const useSaveProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profile: Profile) => api.profile.update(profile),
    onSuccess: profile => queryClient.setQueryData(['profile'], profile),
  });
};

export const useFavorites = (enabled: boolean) =>
  useQuery({ queryKey: ['favorites'], queryFn: api.favorites.list, enabled, retry: false });

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: number; isFavorite: boolean }) =>
      isFavorite ? api.favorites.remove(id) : api.favorites.add(id),
    onSuccess: list => queryClient.setQueryData<UniversityShort[]>(['favorites'], list),
  });
};

// Последний запрос калькулятора — источник баллов для страницы сравнения у гостей.
export const useLastRequest = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery<RecommendationRequest | null>({
    queryKey: ['last-request'],
    queryFn: () => null,
    staleTime: Infinity,
    initialData: null,
  });
  return {
    lastRequest: data,
    setLastRequest: (request: RecommendationRequest) =>
      queryClient.setQueryData(['last-request'], request),
  };
};
