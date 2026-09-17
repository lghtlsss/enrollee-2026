'use client';

import { useLastRequest, useProfile, useSaveProfile, useUser } from '@/src/hooks/use-auth';
import { api } from '@/src/utils/api';
import { EDUCATION_FORMS, type SubjectName } from '@/src/utils/constants';
import { requestToSearchParams } from '@/src/utils/functions';
import type { Profile, RecommendationRequest } from '@/src/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input, Label, Select } from '../ui/input';
import { ScoreInput, type ScoreRow } from './score-input';

const DEFAULT_ROWS: ScoreRow[] = [
  { subject: 'Русский язык', score: '' },
  { subject: 'Математика', score: '' },
  { subject: 'Информатика', score: '' },
];

const rowsFromScores = (scores: Record<string, number>): ScoreRow[] => {
  const rows = Object.entries(scores).map(([subject, score]) => ({
    subject: subject as SubjectName,
    score: String(score),
  }));
  return rows.length ? rows : DEFAULT_ROWS;
};

export const Calculator = ({ initial }: { initial?: RecommendationRequest | null }) => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { data: profile } = useProfile(isAuthenticated);
  const saveProfile = useSaveProfile();
  const { setLastRequest } = useLastRequest();
  const { data: directions } = useQuery({ queryKey: ['directions'], queryFn: api.directions.list });

  const [rows, setRows] = useState<ScoreRow[]>(
    initial ? rowsFromScores(initial.scores) : DEFAULT_ROWS,
  );
  const [directionId, setDirectionId] = useState(
    initial?.direction_id ? String(initial.direction_id) : '',
  );
  const [city, setCity] = useState(initial?.city ?? '');
  const [budgetOnly, setBudgetOnly] = useState(initial?.budget_only ?? true);
  const [educationForm, setEducationForm] = useState<Profile['education_form']>('fullTime');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial || !profile || !Object.keys(profile.scores).length) return;
    setRows(rowsFromScores(profile.scores));
    setDirectionId(profile.direction_id ? String(profile.direction_id) : '');
    setCity(profile.city ?? '');
    setBudgetOnly(profile.budget_only);
    setEducationForm(profile.education_form ?? 'fullTime');
  }, [profile, initial]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const scores: Record<string, number> = {};
    for (const row of rows) {
      const value = Number(row.score);
      if (row.score === '' || Number.isNaN(value) || value < 0 || value > 100) {
        setError(`Введите балл от 0 до 100 по предмету «${row.subject}»`);
        return;
      }
      scores[row.subject] = value;
    }
    setError(null);

    const request: RecommendationRequest = {
      scores,
      direction_id: directionId ? Number(directionId) : null,
      city: city.trim() || null,
      budget_only: budgetOnly,
    };
    setLastRequest(request);
    if (isAuthenticated) {
      saveProfile.mutate({
        ...request,
        direction_id: request.direction_id ?? null,
        city: request.city ?? null,
        education_form: educationForm,
      });
    }
    router.push(`/recommendations?${requestToSearchParams(request)}`);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Подбор вуза">
        <ScoreInput rows={rows} onChange={setRows} />

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-base font-semibold text-navy">Предпочтения</legend>
          <div className="flex flex-col gap-1">
            <Label htmlFor="direction">Направление</Label>
            <Select
              id="direction"
              value={directionId}
              onChange={e => setDirectionId(e.target.value)}>
              <option value="">Любое</option>
              {directions?.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              list="cities"
              placeholder="Любой"
              value={city}
              onChange={e => setCity(e.target.value)}
              autoComplete="off"
            />
            <datalist id="cities">
              {['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'].map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="educationForm">Форма обучения</Label>
            <Select
              id="educationForm"
              value={educationForm ?? 'fullTime'}
              onChange={e => setEducationForm(e.target.value as Profile['education_form'])}>
              {EDUCATION_FORMS.map(f => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Финансирование</Label>
            <div
              className="grid grid-cols-2 gap-1 rounded-xl bg-lavender-soft p-1"
              role="radiogroup"
              aria-label="Финансирование">
              {[
                { value: true, label: 'Бюджет' },
                { value: false, label: 'Бюджет и платное' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  type="button"
                  role="radio"
                  aria-checked={budgetOnly === option.value}
                  onClick={() => setBudgetOnly(option.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    budgetOnly === option.value
                      ? 'bg-navy text-white'
                      : 'text-navy hover:bg-lavender'
                  }`}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm font-medium text-chance-low-ink">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            {isAuthenticated
              ? 'Профиль сохранится автоматически.'
              : 'Войдите, чтобы сохранить баллы и избранное.'}
          </p>
          <Button type="submit" className="sm:min-w-56">
            Подобрать вузы
          </Button>
        </div>
      </form>
    </Card>
  );
};
