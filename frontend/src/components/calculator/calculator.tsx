'use client';
import { useState } from 'react';
import { UniversityFilters } from './university-filters/univercity-filters';
import { ExamsResultForm } from './user-info/exams-result-form';
import { UserInfoForm } from './user-info/user-info-form';

export const Calculator = () => {
  const [currentCard, setCurrentCard] = useState<number>(1);
  const nextCard = () => {
    setCurrentCard(prev => Math.min(3, prev + 1));
  };
  const prevCard = () => {
    setCurrentCard(prev => Math.max(1, prev - 1));
  };
  console.log(currentCard);
  return (
    <div className="relative mx-auto flex h-200 w-125 flex-col gap-4">
      <ExamsResultForm nextCard={nextCard} currentCard={currentCard} />
      <UserInfoForm nextCard={nextCard} prevCard={prevCard} currentCard={currentCard} />
      <UniversityFilters prevCard={prevCard} currentCard={currentCard} />
    </div>
  );
};
