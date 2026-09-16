import { University } from '@/utils/types';
import { StarIcon } from '../ui/icons/star';
import { Link } from '../ui/link';

const VibeScore = ({ vibeValue }: { vibeValue: number }) => {
  if (vibeValue > 100) {
    return <div className="h-10 w-10 rounded-full border-2 bg-green-600"></div>;
  } else if (vibeValue > 50) {
    return <div className="h-10 w-10 rounded-full border-2 bg-yellow-500"></div>;
  } else {
    return <div className="h-10 w-10 rounded-full border-2 bg-red-600"></div>;
  }
};

export const UniversitiesItem = ({ university }: { university: University }) => {
  return (
    <div className="flex flex-col gap-4 border-2 p-2">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <span>{university.name}</span>
          <div className="flex items-center">
            {university.rating}
            <StarIcon className="h-5 w-5" />
          </div>
        </div>
        <span>
          <VibeScore vibeValue={university.vibeValue} />
        </span>
      </div>
      <div className="flex justify-between">
        <Link href={`/universities/${university.id}`}>Подробнее</Link>
        <div className="flex flex-col items-center gap-2">
          <p>Проходные баллы в 2026</p>
          <span className="rounded-4xl border-2 px-4 py-2">{university.passingScore}</span>
        </div>
      </div>
    </div>
  );
};
