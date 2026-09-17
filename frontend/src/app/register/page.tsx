import { AuthCard } from '@/components/auth/auth-card';
import { RegisterForm } from '@/components/auth/register-form';
import { Link } from '@/components/ui/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Регистрация — UniVibe' };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Создать аккаунт"
      subtitle="Только email и пароль."
      footer={
        <>
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </>
      }>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
