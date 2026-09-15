from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session

from sqlalchemy import create_engine


class Base(DeclarativeBase):
    pass


DB_URL = ""  # сделать через .env

engine = create_engine(DB_URL)

SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
