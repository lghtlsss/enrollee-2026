import { AuthGate } from '@/src/components/auth/auth-gate';
import { FavoritesList } from '@/src/components/favorites/favorites-list';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Избранное — UniVibe' };

export default function FavoritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">Избранное</h1>
        <p className="mt-1 text-sm text-muted">
          Вузы, которые вы сохранили, чтобы вернуться к ним позже.
        </p>
      </div>
      <AuthGate
        title="Войдите, чтобы увидеть избранное"
        description="Сохранённые вузы привязаны к вашему аккаунту."
        next="/favorites">
        <FavoritesList />
      </AuthGate>
    </div>
  );
}
