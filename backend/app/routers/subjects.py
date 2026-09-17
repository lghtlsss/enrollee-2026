from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Subject

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("")
def get_all_subjects(db: Session = Depends(get_db)):
    return db.execute(select(Subject).scalars().all())


@router.get("/{subject_name}", response_model=...)
def get_subject_by_name(subject_name: str, db: Session = Depends(get_db)):
    db_subject = db.execute(select(Subject).where(Subject.name == subject_name).scalar_one_or_none())
    if db_subject is None:
        raise HTTPException(404, "Subject not found")

    return db_subject


@router.get("/{subject_id}")
def get_subject_by_id(subject_id: int, db: Session = Depends(get_db)):
    db_subject = db.get(Subject, subject_id)
    if db_subject is None:
        raise HTTPException(404, "Subject not found")

    return db_subject
