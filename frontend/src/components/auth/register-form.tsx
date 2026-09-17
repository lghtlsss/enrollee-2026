'use client';

import { api, setToken } from '@/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/input';
import { safeNext } from './login-form';

export const RegisterForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const register = useMutation({
    mutationFn: async (data: { name: string; surname: string; email: string; password: string }) => {
      await api.auth.register(data);
      const token = await api.auth.login({ email: data.email, password: data.password });
      setToken(token.access_token);
      return api.auth.me();
    },
    onSuccess: user => {
      queryClient.setQueryData(['user'], user);
      router.push(safeNext(params.get('next')));
    },
    onError: (e: Error) =>
      setError(
        e.message === 'Email already registered' ? 'Этот email уже зарегистрирован' : e.message,
      ),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get('password')!.toString();
    if (password !== form.get('confirm')!.toString()) {
      setError('Пароли не совпадают');
      return;
    }
    setError(null);
    register.mutate({
      name: form.get('name')!.toString().trim(),
      surname: form.get('surname')!.toString().trim(),
      email: form.get('email')!.toString().trim(),
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Регистрация">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" autoComplete="given-name" required maxLength={30} />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="surname">Фамилия</Label>
          <Input id="surname" name="surname" autoComplete="family-name" required maxLength={30} />
        </div>
      </div>
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
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Минимум 6 символов"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="confirm">Повторите пароль</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={6} />
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-chance-low-ink">
          {error}
        </p>
      )}
      <Button type="submit" disabled={register.isPending}>
        {register.isPending ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
      </Button>
    </form>
  );
};
