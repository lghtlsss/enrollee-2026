import { StarIcon } from '../ui/icons/star';

const data = {
  id: 1,
  name: 'МФТИ',
  description: 'Ведущий технический вуз...',
  city: 'Москва',
  website: 'https://mipt.ru',
  rating: 4.8,
  vibe: {
    education: 4.5,
    career: 4.7,
    student_life: 3.9,
    atmosphere: 4.2,
    workload: 4.8,
  },
  programs: [{ id: 10, name: 'Прикладная математика и физика', direction_id: 3 }],
};

export const University = async ({ universityId }: { universityId: number }) => {
  // const response = await fetch(`${BACKEND_URL}/universities/${universityId}`);
  // if (response.status == 404) return null;
  // if (!response.ok) throw Error('Ошибка запроса');
  // const data: UniversityDetails = await response.json();
  return (
    <>
      <h1 className="flex">
        {data.name} <StarIcon className="h-5 w-5" /> {data.rating}
      </h1>
    </>
  );
};
