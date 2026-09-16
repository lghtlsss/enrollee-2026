import { BACKEND_URL, exampleUser } from './constants';
import { User } from './types';

export const getUser = async (): Promise<User> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return exampleUser;
  }
  const response = await fetch(`${BACKEND_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Не удалось получить пользователя');
  }

  return await response.json();
};
