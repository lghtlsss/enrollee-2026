from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Subject
from app.schemas import SSubjectResponse

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("")
def get_all_subjects(db: Session = Depends(get_db)):
    """Получить список всех предметов"""
    return db.execute(select(Subject)).scalars().all()


@router.get("/by-name/{subject_name}", response_model=SSubjectResponse)
def get_subject_by_name(subject_name: str, db: Session = Depends(get_db)):
    """Получить предмет по имени"""
    db_subject = db.execute(select(Subject).where(Subject.name == subject_name)).scalar_one_or_none()
    if db_subject is None:
        raise HTTPException(404, "Subject not found")

    return db_subject


@router.get("/by-id/{subject_id}", response_model=SSubjectResponse)
def get_subject_by_id(subject_id: int, db: Session = Depends(get_db)):
    """Получить предмет по ID"""
    db_subject = db.get(Subject, subject_id)
    if db_subject is None:
        raise HTTPException(404, "Subject not found")

    return db_subject
