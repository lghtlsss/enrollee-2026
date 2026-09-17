# Enrollee-2026

Сервис для повышения комфорта поступления в вузы России: подбор программ по баллам ЕГЭ, избранное, отзывы и отслеживание дедлайнов.

## Возможности

- подбор вузов по баллам, направлению и городу;
- фильтр по необходимости общежития;
- избранные вузы для авторизованных пользователей;
- отзывы с рейтингом от 1 до 5 с шагом 0.5;
- профиль абитуриента и сохранение баллов;
- отслеживание тестовых дедлайнов;
- рекомендации с оценкой шанса поступления.

## Структура проекта

```text
backend/   FastAPI, SQLAlchemy, Alembic, PostgreSQL
frontend/  Next.js, React, TypeScript
```

## Локальный запуск

### Backend

Создай файл `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=change-this-secret
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_ALGORITHM=HS256
```

Установи зависимости и запусти миграции:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
python -m app.seed --reset
uvicorn app.main:app --reload
```

Backend будет доступен по адресу `http://localhost:8000`.

### Frontend

Создай файл `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Запусти приложение:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу `http://localhost:3000`.

## Тестовый пользователь seed

```text
Email: seed@example.com
Пароль: seed-password
```

Seed создаёт тестовые университеты, направления, программы, проходные баллы, общежития и отзывы.

## Деплой

Docker не требуется.

- Frontend: [Vercel](https://vercel.com/) — Root Directory `frontend`.
- Backend: [Render](https://render.com/) — Root Directory `backend`.
- PostgreSQL: [Neon](https://neon.tech/).

Для backend на Render:

```bash
pip install -r requirements.txt
```

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Переменные окружения на Render:

```text
DATABASE_URL
JWT_SECRET
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_ALGORITHM=HS256
```

После создания backend выполни миграции:

```bash
alembic upgrade head
python -m app.seed --reset
```

На Vercel добавь:

```text
NEXT_PUBLIC_BACKEND_URL=https://адрес-backend.onrender.com
```

Не добавляй `.env` и `.env.local` в GitHub. Секреты храни только в настройках хостинга.
