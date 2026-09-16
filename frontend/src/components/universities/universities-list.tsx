import { University } from '@/utils/types';
import { Link } from '../ui/link';
import { UniversitiesItem } from './universities-item';

const testData: University[] = [
  {
    id: 1,
    name: 'ВШЭ',
    city: 'Москва',
    description: 'Описание',
    passingScore: 300,
    educationCost: 900000,
    freePlacesCount: 200,
    rating: 100.1,
    vibeValue: 42,
  },
  {
    id: 2,
    name: 'ВШЭ',
    city: 'Москва',
    description: 'Описание',
    passingScore: 300,
    educationCost: 900000,
    freePlacesCount: 200,
    rating: 100.1,
    vibeValue: 42,
  },
];

export const UniversitiesList = async ({ page }: { page: number }) => {
  //  const response = await fetch(`https://universities.list?page=${page}`);
  //  const data = await response.json();
  //  console.log(page);

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
