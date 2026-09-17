'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Input, Label, Select } from '@/components/ui/input';
import { useProfile, useSaveProfile } from '@/hooks/use-auth';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const ProfilePreferencesForm = () => {
  const { data: profile, isPending: isProfilePending } = useProfile(true);
  const saveProfile = useSaveProfile();
  const { data: directions, isPending: areDirectionsPending } = useQuery({
    queryKey: ['directions'],
    queryFn: api.directions.list,
  });

  const [city, setCity] = useState('');
  const [directionId, setDirectionId] = useState('');
  const [wantsBudget, setWantsBudget] = useState(true);
  const [needsDormitory, setNeedsDormitory] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setCity(profile.city ?? '');
    setWantsBudget(profile.wants_budget);
    setNeedsDormitory(profile.needs_dormitory);
  }, [profile]);

  useEffect(() => {
    if (!profile || !directions) return;
    const direction = directions.find(item => item.name === profile.field_of_study);
    setDirectionId(direction ? String(direction.id) : '');
  }, [directions, profile]);

  const handleSubmit = () => {
    const direction = directions?.find(item => item.id === Number(directionId));
    setMessage(null);
    saveProfile.mutate(
      {
        city: city.trim() || null,
        field_of_study: direction?.name ?? null,
        wants_budget: wantsBudget,
        needs_dormitory: needsDormitory,
      },
      {
        onSuccess: () => setMessage('Настройки профиля сохранены.'),
        onError: error =>
          setMessage(error instanceof Error ? error.message : 'Не удалось сохранить настройки.'),
      },
    );
  };

  if (isProfilePending || areDirectionsPending) {
    return <Card className="h-48 animate-pulse bg-lavender-soft" />;
  }

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-navy-deep">Предпочтения</h2>
        <p className="mt-1 text-sm text-muted">
          Эти настройки используются при подборе вузов.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="profile-city">Город</Label>
          <Input
            id="profile-city"
            value={city}
            onChange={event => setCity(event.target.value)}
            placeholder="Любой"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="profile-direction">Направление</Label>
          <Select
            id="profile-direction"
            value={directionId}
            onChange={event => setDirectionId(event.target.value)}>
            <option value="">Любое</option>
            {directions?.map(direction => (
              <option key={direction.id} value={direction.id}>
                {direction.name}
              </option>
            ))}
          </Select>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={wantsBudget}
            onChange={event => setWantsBudget(event.target.checked)}
          />
          Рассматривать только бюджет
        </label>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={needsDormitory}
            onChange={event => setNeedsDormitory(event.target.checked)}
          />
          Нужно общежитие
        </label>
      </div>

      {message && <p className="mt-4 text-sm text-muted">{message}</p>}

      <Button type="button" className="mt-5" onClick={handleSubmit} disabled={saveProfile.isPending}>
        {saveProfile.isPending ? 'Сохраняем…' : 'Сохранить предпочтения'}
      </Button>
    </Card>
  );
};
