'use client';

import { api, clearToken, getToken, setToken } from '@/src/utils/api';
import type {
  ProfileUpdate,
  RecommendationRequest,
  ReviewCreate,
  UniversityShort,
  UpdateSubjects,
} from '@/src/utils/types';
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
    mutationFn: (profile: ProfileUpdate) => api.profile.update(profile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
};

export const useSaveScores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scores: UpdateSubjects) => api.profile.updateScores(scores),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
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

export const useCreateReview = (universityId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ReviewCreate, 'uni_id'>) =>
      api.reviews.create({
        ...data,
        uni_id: universityId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['university-reviews', universityId],
      });
    },
  });
};

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
