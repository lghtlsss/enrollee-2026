'use client';

import {
  useLastRequest,
  useProfile,
  useSaveProfile,
  useSaveScores,
  useUser,
} from '@/src/hooks/use-auth';
import { api } from '@/src/utils/api';
import { type SubjectName } from '@/src/utils/constants';
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

const rowsFromProfile = (subjects: Profile['subjects']): ScoreRow[] => {
  const rows = subjects.map(subject => ({
    subject: subject.subject_name as SubjectName,
    score: String(subject.score),
  }));
  return rows.length ? rows : DEFAULT_ROWS;
};

export const Calculator = ({ initial }: { initial?: RecommendationRequest | null }) => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { data: profile } = useProfile(isAuthenticated);
  const saveProfile = useSaveProfile();
  const saveScores = useSaveScores();
  const { setLastRequest } = useLastRequest();
  const { data: directions } = useQuery({ queryKey: ['directions'], queryFn: api.directions.list });
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: api.subjects.list,
  });

  const [rows, setRows] = useState<ScoreRow[]>(
    initial ? rowsFromScores(initial.scores) : DEFAULT_ROWS,
  );
  const [directionId, setDirectionId] = useState(
    initial?.direction_id ? String(initial.direction_id) : '',
  );
  const [city, setCity] = useState(initial?.city ?? '');
  const [budgetOnly, setBudgetOnly] = useState(initial?.budget_only ?? true);
  const [needsDormitory, setNeedsDormitory] = useState(initial?.needs_dormitory ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initial || !profile) return;
    const subjects = profile.subjects ?? [];
    if (subjects.length) {
      setRows(rowsFromProfile(subjects));
    }
    const direction = directions?.find(item => item.name === profile.field_of_study);
    setDirectionId(direction ? String(direction.id) : '');
    setCity(profile.city ?? '');
    setBudgetOnly(profile.wants_budget);
    setNeedsDormitory(profile.needs_dormitory);
  }, [directions, profile, initial]);

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
      needs_dormitory: needsDormitory,
    };
    setLastRequest(request);
    if (isAuthenticated) {
      const selectedDirection = directions?.find(item => item.id === request.direction_id);
      const subjectsByName = new Map(subjects?.map(subject => [subject.name, subject.id]));
      const profileSubjects = rows.flatMap(row => {
        const subjectId = subjectsByName.get(row.subject);
        return subjectId === undefined ? [] : [{ subject_id: subjectId, score: Number(row.score) }];
      });

      if (profileSubjects.length !== rows.length) {
        setError('Не удалось сопоставить один из предметов с данными backend');
        return;
      }

      saveProfile.mutate({
        city: request.city,
        field_of_study: selectedDirection?.name ?? null,
        wants_budget: request.budget_only,
        needs_dormitory: request.needs_dormitory,
      });
      saveScores.mutate({
        subjects: profileSubjects,
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
          <div className="flex flex-col gap-1">
            <Label>Общежитие</Label>
            <div
              className="grid grid-cols-2 gap-1 rounded-xl bg-lavender-soft p-1"
              role="radiogroup"
              aria-label="Общежитие">
              {[
                { value: false, label: 'Не нужно' },
                { value: true, label: 'Нужно' },
              ].map(option => (
                <button
                  key={String(option.value)}
                  type="button"
                  role="radio"
                  aria-checked={needsDormitory === option.value}
                  onClick={() => setNeedsDormitory(option.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    needsDormitory === option.value
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
