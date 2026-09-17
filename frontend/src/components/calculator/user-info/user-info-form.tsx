'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/utils/types';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitEvent } from 'react';

export const UserInfoForm = ({
  nextCard,
  prevCard,
  currentCard,
}: {
  nextCard: () => void;
  prevCard: () => void;
  currentCard: number;
}) => {
  const queryClient = useQueryClient();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const direction = formData.get('direction')?.toString();
    const city = formData.get('city')?.toString();
    const educationForm = formData.get('educationForm')?.toString();

    if (!direction) return;

    queryClient.setQueryData(['user'], (oldUser: User) => {
      if (!oldUser) return oldUser;

      return {
        ...oldUser,
        direction,
        city,
        educationForm,
      };
    });
    nextCard();
  };
  return (
    <form
      className="absolute flex w-125 flex-col gap-2 border-2 p-2 transition duration-500"
      style={{ transform: `translateX(${(2 - currentCard) * 1920}px)` }}
      onSubmit={handleSubmit}>
      <Button type="button" onClick={prevCard} className="w-fit">
        Назад
      </Button>
      <Input
        id="direction"
        name="direction"
        type="text"
        required={true}
        placeholder="Направление"
      />
      <Input id="city" name="city" type="text" placeholder="Город" />
      <div className="flex gap-2">
        <p>Форма обучения</p>
        <select id="educationForm" name="educationForm">
          <option value="fullTime">Очная</option>
          <option value="partTime">Очно-заочная</option>
          <option value="extramural">Заочная</option>
        </select>
      </div>
      <Button type="submit">Готово</Button>
    </form>
  );
};
