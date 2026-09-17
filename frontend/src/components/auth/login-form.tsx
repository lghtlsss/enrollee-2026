'use client';

import { api, setToken } from '@/src/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input, Label } from '../ui/input';

// Разрешаем редирект только на внутренние пути, чтобы ?next= нельзя было увести на чужой сайт.
export const safeNext = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

export const LoginForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const token = await api.auth.login(data);
      setToken(token.access_token);
      return api.auth.me();
    },
    onSuccess: user => {
      queryClient.setQueryData(['user'], user);
      router.push(safeNext(params.get('next')));
    },
    onError: (e: Error) =>
      setError(e.message === 'Invalid email or password' ? 'Неверный email или пароль' : e.message),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    login.mutate({
      email: form.get('email')!.toString().trim(),
      password: form.get('password')!.toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Вход">
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-chance-low-ink">
          {error}
        </p>
      )}
      <Button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Входим…' : 'Войти'}
      </Button>
    </form>
  );
};
