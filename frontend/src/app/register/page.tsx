import { AuthCard } from '@/src/components/auth/auth-card';
import { RegisterForm } from '@/src/components/auth/register-form';
import { Link } from '@/src/components/ui/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Регистрация — UniVibe' };

export default function RegisterPage() {
  return (
    <AuthCard
      title="Создать аккаунт"
      subtitle="Только email и пароль. Никаких сканов документов — это к Госуслугам."
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
