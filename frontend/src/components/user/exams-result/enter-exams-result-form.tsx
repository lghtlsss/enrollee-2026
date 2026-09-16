'use client';
import { Button } from '@/components/ui/button';
import { subjectToName } from '@/utils/constants';
import { ExamsScore, User } from '@/utils/types';
import { useQueryClient } from '@tanstack/react-query';
import { SubmitEvent, useState } from 'react';
import { Input } from '../../ui/input';
import { AddExamResultButton } from './add-exam-result-button';

export const EnterExamsResultForm = () => {
  const [exams, setExams] = useState<string[]>(['russian']);
  const queryClient = useQueryClient();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newExams: ExamsScore = {};
    const formData = new FormData(e.target);
    for (const [name, value] of formData.entries()) {
      newExams[name as keyof typeof newExams] = Number(value.toString());
    }
    // fetch(https://change-user-results);
    queryClient.setQueryData(['user'], (oldUser: User) => {
      console.log(oldUser);
      if (!oldUser) return oldUser;

      return {
        ...oldUser,
        examsScore: newExams,
      };
    });
  };

  const addExam = (exam: string) => {
    setExams([exam, ...exams]);
  };

  const removeExam = (exam: string) => {
    setExams(exams.filter(item => item != exam));
  };
  return (
    <div className="mx-auto flex w-125 flex-col gap-4 border-2 p-2">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        {exams.map(item => (
          <div key={item} className="flex items-center justify-between">
            <p>{subjectToName[item as keyof typeof subjectToName]}</p>
            <div className="flex gap-2">
              <Button type="button" onClick={e => removeExam(item)}>
                Убрать
              </Button>
              <Input
                max={100}
                min={0}
                type="number"
                placeholder="100"
                required={true}
                id={item}
                name={item}
              />
            </div>
          </div>
        ))}
        <Button type="submit">Готово</Button>
      </form>
      <AddExamResultButton existingResults={exams} addExam={addExam} />
    </div>
  );
};
