import { Button } from '@/components/ui/button';
import { StarIcon } from '@/components/ui/icons/star';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { SubmitEvent } from 'react';

export const UniversityFilters = ({
  prevCard,
  currentCard,
}: {
  prevCard: () => void;
  currentCard: number;
}) => {
  const router = useRouter();
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    if (formData.get('dormitory')) {
      params.set('dormitory', 'true');
    }

    const isBudget = formData.get('isBudget');
    if (isBudget) {
      params.set('isBudget', isBudget.toString());
    }

    const ratings = formData.getAll('rating');

    ratings.forEach(rating => {
      params.append('rating', rating.toString());
    });

    router.push(`/universities?${params.toString()}`);
  };
  return (
    <form
      className="absolute flex w-full flex-col border-2 p-2 transition duration-500"
      style={{ transform: `translateX(${(3 - currentCard) * 1920}px)` }}
      onSubmit={handleSubmit}>
      <Button type="button" onClick={prevCard} className="w-fit">
        Назад
      </Button>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <label htmlFor="dormitory">Общежитие</label>
          <Input type="checkbox" id="dormitory" name="dormitory" defaultChecked={true} />
        </div>
        <div className="flex gap-2">
          <div>
            <label htmlFor="budget">Бюджет</label>
            <Input id="budget" name="isBudget" type="radio" value="budget" defaultChecked={true} />
          </div>
          <div>
            <label htmlFor="commercial">Коммерция</label>
            <Input id="commercial" name="isBudget" type="radio" value="commercial" />
          </div>
        </div>
      </div>
      <div>
        <p className="flex items-center">
          Рейтинг <StarIcon className="h-4 w-4" />
        </p>
        <ul className="flex gap-2">
          {[1, 2, 3, 4, 5].map(item => (
            <div key={item}>
              <label>{item}</label>
              <Input type="checkbox" value={item} id={item.toString()} name="rating" />
            </div>
          ))}
        </ul>
      </div>
      <Button type="submit">Готово</Button>
    </form>
  );
};
