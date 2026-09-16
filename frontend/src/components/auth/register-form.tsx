'use client';
import { REGISTER_URL } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const register = async ({ email, password }: { email: string; password: string }) => {
  const response = await fetch(REGISTER_URL, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationFn: register,
    onSuccess: () => router.push('#'),
    onError: e => setErrorMessage(e.message),
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const passwordRepeat = formData.get('password-repeat')?.toString();
    if (email && password && password == passwordRepeat) {
      mutate({ email, password });
    } else {
      setErrorMessage('Пароли должны совпадать');
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
      <Input
        className="border-2 p-2"
        id="password-repeat"
        name="password-repeat"
        placeholder="повторите пароль"
        onChange={_ => setErrorMessage(null)}
        required={true}
      />
      <Button disabled={isPending} type="submit">
        Зарегистрироваться
      </Button>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  );
};
