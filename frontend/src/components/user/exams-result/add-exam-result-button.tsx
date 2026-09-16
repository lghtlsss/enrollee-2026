import { Button } from '@/components/ui/button';
import { subjectToName } from '@/utils/constants';
import { SubmitEvent } from 'react';

export const AddExamResultButton = ({
  existingResults,
  addExam,
}: {
  existingResults: string[];
  addExam: (exam: string) => void;
}) => {
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const exam = formData.get('exam')?.toString();
    if (!exam) {
      return;
    }
    addExam(exam);
  };
  return (
    <form onSubmit={handleSubmit}>
      <p>Добавить результат экзамена</p>
      <select required={true} id="exam" name="exam">
        {Object.keys(subjectToName)
          .filter(item => !existingResults.includes(item))
          .map(item => (
            <option key={item} value={item}>
              {subjectToName[item as keyof typeof subjectToName]}
            </option>
          ))}
      </select>
      <Button type="submit">Добавить</Button>
    </form>
  );
};
