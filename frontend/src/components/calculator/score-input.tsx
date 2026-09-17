'use client';

import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';
import { SUBJECTS, type SubjectName } from '@/utils/constants';

export type ScoreRow = { subject: SubjectName; score: string };

export const ScoreInput = ({
  rows,
  onChange,
}: {
  rows: ScoreRow[];
  onChange: (rows: ScoreRow[]) => void;
}) => {
  const used = new Set(rows.map(r => r.subject));
  const available = SUBJECTS.filter(s => !used.has(s));

  const update = (index: number, patch: Partial<ScoreRow>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const remove = (index: number) => onChange(rows.filter((_, i) => i !== index));

  const add = () => {
    if (!available.length) return;
    onChange([...rows, { subject: available[0], score: '' }]);
  };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-base font-semibold text-navy">Баллы ЕГЭ</legend>
      {rows.map((row, index) => (
        <div key={row.subject} className="grid grid-cols-[1fr_88px_auto] items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor={`subject-${index}`}>Предмет</Label>
            <Select
              id={`subject-${index}`}
              value={row.subject}
              onChange={e => update(index, { subject: e.target.value as SubjectName })}>
              {SUBJECTS.filter(s => s === row.subject || !used.has(s)).map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor={`score-${index}`}>Балл</Label>
            <Input
              id={`score-${index}`}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              required
              placeholder="0–100"
              value={row.score}
              onChange={e => update(index, { score: e.target.value })}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Убрать ${row.subject}`}
            onClick={() => remove(index)}
            disabled={rows.length <= 1}
            className="px-3">
            ✕
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={add}
        disabled={!available.length}
        className="self-start">
        + Добавить предмет
      </Button>
    </fieldset>
  );
};
