import { exampleUser } from './constants';

export const getUser = () => {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return exampleUser;
  }
  return exampleUser;
};
