'use client';

import { api, clearToken, getToken } from '@/src/utils/api';
import type { Profile, RecommendationRequest, UniversityShort } from '@/src/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

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

  const setLastRequest = useCallback(
    (request: RecommendationRequest) => queryClient.setQueryData(['last-request'], request),
    [queryClient],
  );

  return {
    lastRequest: data,
    setLastRequest,
  };
};
