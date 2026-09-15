import { Link } from './ui/link';

export const Header = () => {
  return (
    <header className="flex h-20 items-center justify-between border-b-2 p-2">
      <div className="text-xl">Название</div>
      <div className="flex gap-2">
        <Link href="/login">Войти</Link>
        <Link href="/register">Зарегестрироваться</Link>
      </div>
    </header>
  );
};
