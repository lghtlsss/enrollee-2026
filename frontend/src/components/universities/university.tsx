'use client';

import { api } from '@/src/utils/api';
import type { UniversityDetail } from '@/src/utils/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FavoriteButton } from './favorite-button';
import { ReviewCard } from './review-card';

const SECTIONS = ['Обзор', 'Программы', 'Кампус', 'Отзывы'] as const;
type Section = (typeof SECTIONS)[number];

export const University = ({ universityId }: { universityId: number }) => {
  const [section, setSection] = useState<Section>('Обзор');

  const { data, isPending, error } = useQuery({
    queryKey: ['university', universityId],
    queryFn: () => api.universities.get(universityId),
  });
  const reviewsQuery = useQuery({
    queryKey: ['university-reviews', universityId],
    queryFn: () => api.universities.reviews(universityId),
    enabled: section === 'Отзывы',
  });

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5]">
        <p className="text-sm text-[#5B6270]">Загружаем институт…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F5] px-6 text-center">
        <div>
          <p className="mb-1 font-medium text-[#1F2430]">
            Не получилось загрузить страницу института
          </p>
          <p className="text-sm text-[#5B6270]">
            Проверьте ссылку или попробуйте обновить страницу.
          </p>
        </div>
      </div>
    );
  }

  const university = data as UniversityDetail;
  const vibe = university.vibe;

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      {/* Шапка */}
      <header className="relative bg-[#2C3E6B] px-6 pt-10 pb-8 sm:px-10">
        <div className="absolute top-6 right-6 sm:right-10">
          <FavoriteButton universityId={university.id} />
        </div>

        <p className="font-serif text-sm tracking-tight text-[#AEB9DA]">UniVibe</p>
        <h1 className="mt-2 font-serif text-4xl leading-tight text-white sm:text-5xl">
          {university.name}
        </h1>
        <p className="mt-2 text-sm text-[#C7CFE8]">
          {university.city}
          {university.rating !== null && (
            <span className="ml-3 text-[#E8935B]">★ {university.rating.toFixed(1)}</span>
          )}
        </p>
      </header>

      {/* Пилюли-разделы */}
      <nav className="border-b border-[#E4E1D8] bg-white px-6 py-4 sm:px-10">
        <ul className="flex flex-wrap gap-3">
          {SECTIONS.map(s => {
            const active = s === section;
            return (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setSection(s)}
                  className={
                    'rounded-full px-5 py-2 text-sm transition-colors ' +
                    (active
                      ? 'bg-[#2C3E6B] text-white'
                      : 'bg-[#EEF0F6] text-[#3B4152] hover:bg-[#E4E7F1]')
                  }>
                  {s}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="px-6 py-8 sm:px-10">
        {section === 'Обзор' && (
          <div className="flex flex-col gap-4 rounded-xl border border-[#E4E1D8] bg-white p-4 sm:flex-row sm:items-center">
            <div className="h-24 w-24 shrink-0 rounded-lg border border-[#E4E1D8] bg-[#F2F0E9]" />

            <div className="flex-1">
              <p className="font-serif text-lg text-[#1F2430]">{university.name}</p>
              <p className="mt-1 max-w-[60ch] text-sm leading-relaxed text-[#5B6270]">
                {university.description ?? 'Описание института пока не добавлено.'}
              </p>
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm text-[#2C3E6B] underline underline-offset-2">
                  Сайт института
                </a>
              )}
            </div>

            {vibe && (
              <div className="flex w-full flex-col gap-2 sm:w-40">
                <VibeBar label="Образование" value={vibe.education ?? 0} color="#8FB996" />
                <VibeBar label="Карьера" value={vibe.career ?? 0} color="#E8935B" />
                <VibeBar label="Атмосфера" value={vibe.atmosphere ?? 0} color="#E6968C" />
              </div>
            )}
          </div>
        )}

        {section === 'Программы' && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {university.programs.length === 0 && (
              <p className="text-sm text-[#5B6270]">Программы пока не добавлены.</p>
            )}
            {university.programs.map(program => (
              <li key={program.id} className="rounded-xl border border-[#E4E1D8] bg-white p-4">
                <p className="text-sm text-[#1F2430]">{program.name}</p>
                <p className="mt-1 text-xs text-[#8B90A0]">
                  Направление №{program.direction_id}
                </p>
              </li>
            ))}
          </ul>
        )}

        {section === 'Кампус' && (
          <p className="text-sm text-[#5B6270]">Раздел о кампусе появится здесь.</p>
        )}

        {section === 'Отзывы' && (
          reviewsQuery.isPending ? (
            <p className="text-sm text-[#5B6270]">Загружаем отзывы…</p>
          ) : reviewsQuery.error ? (
            <p className="text-sm text-[#5B6270]">Не удалось загрузить отзывы.</p>
          ) : reviewsQuery.data?.length ? (
            <div className="flex flex-col gap-3">
              {reviewsQuery.data.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5B6270]">Отзывов пока нет.</p>
          )
        )}
      </main>
    </div>
  );
};

const VibeBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div>
    <div className="mb-1 flex justify-between text-xs text-[#8B90A0]">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF0F6]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);
