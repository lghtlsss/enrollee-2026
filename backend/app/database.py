from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import os

load_dotenv()
DATABASE_URL = os.getenv(
    "DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не найден в окружении")

engine = create_engine(DATABASE_URL, echo=False, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Базовый класс для всех моделей."""
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
