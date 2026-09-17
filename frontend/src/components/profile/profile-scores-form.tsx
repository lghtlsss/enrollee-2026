'use client';

import { Button } from '@/src/components/ui/button';
import { Card } from '@/src/components/ui/card';
import { Input, Label, Select } from '@/src/components/ui/input';
import { useProfile, useSaveScores, useUser } from '@/src/hooks/use-auth';
import { api } from '@/src/utils/api';
import type { SubjectsScores } from '@/src/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type ScoreRow = {
  subject_id: number;
  subject_name: string;
  score: string;
};

const rowsFromProfile = (data: SubjectsScores): ScoreRow[] =>
  data.subjects.map(subject => ({
    subject_id: subject.subject_id,
    subject_name: subject.subject_name,
    score: String(subject.score),
  }));

export const ProfileScoresForm = () => {
  const { user } = useUser();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(true);

  const { data: subjectsCatalog, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: api.subjects.list,
  });

  const saveScores = useSaveScores();

  const [rows, setRows] = useState<ScoreRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    setRows(
      profile.subjects.map(subject => ({
        subject_id: subject.subject_id,
        subject_name: subject.subject_name,
        score: String(subject.score),
      })),
    );
  }, [profile]);

  const updateRow = (index: number, patch: Partial<ScoreRow>) => {
    setRows(current =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    );
  };

  const removeRow = (index: number) => {
    setRows(current => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const addRow = () => {
    if (!subjectsCatalog?.length) return;

    const usedIds = new Set(rows.map(row => row.subject_id));
    const subject = subjectsCatalog.find(item => !usedIds.has(item.id));

    if (!subject) return;

    setRows(current => [
      ...current,
      {
        subject_id: subject.id,
        subject_name: subject.name,
        score: '',
      },
    ]);
  };

  const handleSubjectChange = (index: number, subjectId: number) => {
    const subject = subjectsCatalog?.find(item => item.id === subjectId);

    if (!subject) return;

    updateRow(index, {
      subject_id: subject.id,
      subject_name: subject.name,
    });
  };

  const handleSubmit = () => {
    setError(null);

    for (const row of rows) {
      if (row.score.trim() === '') {
        setError(`Введите балл по предмету «${row.subject_name}»`);
        return;
      }

      const score = Number(row.score);

      if (!Number.isFinite(score) || score < 0 || score > 100) {
        setError(`Балл по предмету «${row.subject_name}» должен быть от 0 до 100`);
        return;
      }

      if (!Number.isInteger(score)) {
        setError(`Балл по предмету «${row.subject_name}» должен быть целым числом`);
        return;
      }
    }

    const subjectIds = rows.map(row => row.subject_id);

    if (new Set(subjectIds).size !== subjectIds.length) {
      setError('Один и тот же предмет нельзя сохранить дважды');
      return;
    }

    saveScores.mutate(
      {
        subjects: rows.map(row => ({
          subject_id: row.subject_id,
          score: Number(row.score),
        })),
      },
      {
        onSuccess: data => {
          setRows(rowsFromProfile(data));
          setError(null);
        },
        onError: mutationError => {
          setError(
            mutationError instanceof Error ? mutationError.message : 'Не удалось сохранить баллы',
          );
        },
      },
    );
  };

  if (isProfileLoading || isSubjectsLoading) {
    return (
      <Card className="flex flex-col gap-4">
        <div className="h-5 w-40 animate-pulse rounded bg-lavender-soft" />
        <div className="h-12 animate-pulse rounded-xl bg-lavender-soft" />
        <div className="h-12 animate-pulse rounded-xl bg-lavender-soft" />
        <div className="h-10 w-40 animate-pulse rounded-pill bg-lavender-soft" />
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card className="border-chance-low bg-chance-low/30 text-sm text-chance-low-ink">
        Не удалось загрузить профиль. Попробуйте обновить страницу.
      </Card>
    );
  }

  const usedIds = new Set(rows.map(row => row.subject_id));
  const canAddSubject = Boolean(subjectsCatalog?.some(subject => !usedIds.has(subject.id)));

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-navy-deep">
            {user?.name} {user?.surname}
          </h2>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>
      </Card>

      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-navy-deep">Баллы ЕГЭ</h2>
          <p className="mt-1 text-sm text-muted">
            Эти баллы используются для расчёта рекомендаций и сохраняются в вашем аккаунте.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {rows.length === 0 && (
            <div className="rounded-xl bg-lavender-soft px-4 py-5 text-sm text-muted">
              Сохранённых баллов пока нет.
            </div>
          )}

          {rows.map((row, index) => (
            <div
              key={`${row.subject_id}-${index}`}
              className="grid grid-cols-[minmax(0,1fr)_88px_auto] items-end gap-2">
              <div className="flex min-w-0 flex-col gap-1">
                <Label htmlFor={`profile-subject-${index}`}>Предмет</Label>

                <Select
                  id={`profile-subject-${index}`}
                  value={String(row.subject_id)}
                  onChange={event => handleSubjectChange(index, Number(event.target.value))}>
                  {subjectsCatalog
                    ?.filter(subject => subject.id === row.subject_id || !usedIds.has(subject.id))
                    .map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor={`profile-score-${index}`}>Балл</Label>

                <Input
                  id={`profile-score-${index}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100}
                  step={1}
                  value={row.score}
                  onChange={event => updateRow(index, { score: event.target.value })}
                  placeholder="0–100"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                aria-label={`Удалить ${row.subject_name}`}
                onClick={() => removeRow(index)}
                className="px-3">
                ✕
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={addRow}
            disabled={!canAddSubject}
            className="self-start">
            + Добавить предмет
          </Button>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-chance-low-ink">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            После сохранения новые баллы будут использоваться при следующем подборе вузов.
          </p>

          <Button type="button" onClick={handleSubmit} disabled={saveScores.isPending}>
            {saveScores.isPending ? 'Сохранение…' : 'Сохранить баллы'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
