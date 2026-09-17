import type { Chance } from './types';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '/api/mock';

export const TOKEN_KEY = 'access_token';

export const SUBJECTS = [
  'Русский язык',
  'Математика',
  'Информатика',
  'Физика',
  'Химия',
  'Биология',
  'История',
  'Обществознание',
  'География',
  'Литература',
  'Иностранный язык',
] as const;

export type SubjectName = (typeof SUBJECTS)[number];

export const EDUCATION_FORMS = [
  { value: 'fullTime', label: 'Очная' },
  { value: 'partTime', label: 'Очно-заочная' },
  { value: 'extramural', label: 'Заочная' },
] as const;

export const CHANCE_META: Record<
  Chance,
  { label: string; hint: string; bar: string; ink: string; order: number }
> = {
  high: {
    label: 'Высокий шанс',
    hint: 'Ваши баллы выше проходного — можно нести оригинал',
    bar: 'bg-chance-high',
    ink: 'text-chance-high-ink',
    order: 0,
  },
  medium: {
    label: 'Средний шанс',
    hint: 'Не хватает до 10 баллов — держите вуз в списке',
    bar: 'bg-chance-medium',
    ink: 'text-chance-medium-ink',
    order: 1,
  },
  low: {
    label: 'Низкий шанс',
    hint: 'Не хватает до 25 баллов — запасной вариант',
    bar: 'bg-chance-low',
    ink: 'text-chance-low-ink',
    order: 2,
  },
  unknown: {
    label: 'Нет данных',
    hint: 'Вуз не опубликовал проходной балл',
    bar: 'bg-line',
    ink: 'text-muted',
    order: 3,
  },
};

export const VIBE_META: { key: keyof import('./types').Vibe; label: string }[] = [
  { key: 'education', label: 'Образование' },
  { key: 'career', label: 'Карьера' },
  { key: 'student_life', label: 'Студенческая жизнь' },
  { key: 'atmosphere', label: 'Атмосфера' },
  { key: 'workload', label: 'Нагрузка' },
];

export const NAV_ITEMS = [
  { href: '/', label: 'Подбор' },
  { href: '/universities', label: 'Вузы' },
  { href: '/favorites', label: 'Избранное' },
] as const;
