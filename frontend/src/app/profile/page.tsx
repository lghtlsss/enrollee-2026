import { AuthGate } from '@/components/auth/auth-gate';
import { ProfilePreferencesForm } from '@/components/profile/profile-preferences-form';
import { ProfileScoresForm } from '@/components/profile/profile-scores-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Профиль — UniVibe',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">Профиль</h1>
        <p className="mt-1 text-sm text-muted">
          Управляйте сохранёнными баллами ЕГЭ и настройками для подбора вузов.
        </p>
      </div>

      <AuthGate
        title="Войдите, чтобы открыть профиль"
        description="Сохранённые баллы и настройки профиля привязаны к вашему аккаунту."
        next="/profile">
        <div className="flex flex-col gap-6">
          <ProfilePreferencesForm />
          <ProfileScoresForm />
        </div>
      </AuthGate>
    </div>
  );
}
