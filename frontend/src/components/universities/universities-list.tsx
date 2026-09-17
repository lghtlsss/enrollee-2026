import { University } from '@/utils/types';
import { Link } from '../ui/link';
import { UniversitiesItem } from './universities-item';

const testData: University[] = [
  {
    id: 1,
    name: 'ВШЭ',
    city: 'Москва',
    rating: 100.1,
  },
  {
    id: 2,
    name: 'ВШЭ',
    city: 'Москва',
    rating: 100.1,
  },
];

export const UniversitiesList = async ({
  page,
  filters,
}: {
  page: number;
  filters: { dormitory?: boolean; isBudget?: boolean; ratings?: string | string[] };
}) => {
  //  const response = await fetch(`https://${BACKEND_URL}/universties?skip=${page-1}&city=${filters.city}`);
  //  const data = await response.json();
  // data.items

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {testData.map(university => (
          <UniversitiesItem key={university.id} university={university} />
        ))}
      </ul>
      <div className="mx-auto mt-4 flex w-fit items-center gap-2">
        <Link href={`/universities?page=${page - 1}`}>Назад</Link>
        <span>{page}</span>
        <Link href={`/universities?page=${page + 1}`}>Вперёд</Link>
      </div>
    </div>
  );
};
