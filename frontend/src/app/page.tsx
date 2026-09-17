import { Calculator } from '@/components/calculator/calculator';
import { searchParamsToRequest } from '@/utils/functions';

const STEPS = [
  {
    title: 'Введите баллы',
    text: 'Только результаты ЕГЭ и пожелания.',
  },
  {
    title: 'Оцените шансы',
    text: 'Зелёная, жёлтая или красная зона по каждой программе с проходным баллом прошлого года.',
  },
  {
    title: 'Проверьте вайб',
    text: 'Отзывы студентов о сессии, общаге и атмосфере.',
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initial = searchParamsToRequest(await searchParams);
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-navy-deep sm:text-3xl">
          Куда поступать с вашими баллами?
        </h1>
        <p className="max-w-2xl text-sm text-muted sm:text-base">
          Введите результаты ЕГЭ — покажем подходящие программы, честные шансы и то, что о вузе
          говорят сами студенты.
        </p>
      </section>

      <Calculator initial={initial} />

      <section aria-label="Как это работает" className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.title} className="rounded-2xl border border-line bg-paper p-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lavender text-xs font-bold text-navy">
              {index + 1}
            </span>
            <h2 className="mt-3 text-sm font-semibold text-navy">{step.title}</h2>
            <p className="mt-1 text-sm text-muted">{step.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
