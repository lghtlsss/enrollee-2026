'use client';
import { LOGIN_URL } from '@/utils/constants';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Ошибка авторизации');
  }
  return response.json();
};

export const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = new QueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: data => {
      localStorage.setItem('access_token', data.access_token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/');
    },
    onError: e => setErrorMessage(e.message),
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    if (email && password) {
      mutate({ email, password });
    } else {
      setErrorMessage('Неверно введённые данные');
    }
  };

  return (
    <form className="mx-auto flex w-125 flex-col gap-2" onSubmit={handleSubmit}>
      <Input id="email" name="email" type="email" placeholder="ваша@почта.com" required={true} />
      <Input
        className="border-2 p-2"
        id="password"
        name="password"
        type="password"
        placeholder="пароль"
        onChange={_ => setErrorMessage(null)}
        required={true}
      />
      <Button disabled={isPending} type="submit">
        Войти
      </Button>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  );
};
