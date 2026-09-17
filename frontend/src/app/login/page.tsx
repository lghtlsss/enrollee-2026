import { AuthCard } from '@/src/components/auth/auth-card';
import { LoginForm } from '@/src/components/auth/login-form';
import { Link } from '@/src/components/ui/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Вход — UniVibe' };

export default function LoginPage() {
  return (
    <AuthCard
      title="С возвращением"
      subtitle="Войдите, чтобы видеть сохранённые баллы, избранное и сравнение."
      footer={
        <>
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </>
      }>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
