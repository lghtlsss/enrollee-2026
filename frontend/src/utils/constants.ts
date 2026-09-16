import { User } from './types';

export const LOGIN_URL = 'https://localhost:4000/login';
export const REGISTER_URL = 'https://localhost:4000/register';
export const BACKEND_URL = 'https://localhost:4000';

export const exampleUser: User = {
  id: -1,
  name: '',
};

export const subjectToName = {
  russian: 'Русский язык',
  math: 'Математика',
  it: 'Информатика',
  physics: 'Физика',
  society: 'Обществознание',
  geography: 'География',
  chemistry: 'Химия',
};
