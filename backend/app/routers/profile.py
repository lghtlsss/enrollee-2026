from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Subject, UserSubject
from app.schemas import (
    SProfileResponse,
    SSubjectsAllScoresResponse,
    SProfileUpdate,
    SUpdateSubjectsAndScores,
    SFullUserResponse
)
from app.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/profile", tags=["Profile"])


def build_profile_response(user):
    return {
        "id": user.id,
        "city": user.city,
        "field_of_study": user.field_of_study,
        "wants_budget": user.wants_budget,
        "needs_dormitory": user.needs_dormitory,
        "subjects": [
            {
                "subject_id": link.subject_id,
                "subject_name": link.subject.name,
                "score": link.score,
            }
            for link in user.subjects
        ],
    }


def build_scores_response(user):
    return {
        "subjects": [
            {
                "subject_id": link.subject_id,
                "subject_name": link.subject.name,
                "score": link.score,
            }
            for link in user.subjects
        ]
    }


@router.get("", response_model=SFullUserResponse)
def get_profile(current_user=Depends(get_current_user)):
    """
    Возвращает профиль абитуриента(то есть не данные пользователя, а именно то что важно при расчете вузов)
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "surname": current_user.surname,
        "city": current_user.city,
        "field_of_study": current_user.field_of_study,
        "wants_budget": current_user.wants_budget,
        "needs_dormitory": current_user.needs_dormitory,
        "subjects": [
            {
                "subject_id": link.subject_id,
                "subject_name": link.subject.name,
                "score": link.score,
            }
            for link in current_user.subjects
        ],
    }


@router.get("/scores", response_model=SSubjectsAllScoresResponse)
def get_subjects_scores(current_user=Depends(get_current_user)):
    """
    Возвращает баллы абитуриента по предметам
    """
    return build_scores_response(current_user)


@router.patch("", response_model=SProfileResponse)
def update_profile(profile_data: SProfileUpdate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Обновляет профиль абитуриента
    """
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return build_profile_response(current_user)


@router.put("/subjects", response_model=SSubjectsAllScoresResponse)
def update_subjects(data: SUpdateSubjectsAndScores, current_user=Depends(get_current_user),
                    db: Session = Depends(get_db)):
    """
    Обновляет список предметов абитуриента
    """
    subject_ids = [item.subject_id for item in data.subjects]

    if len(subject_ids) != len(set(subject_ids)):
        raise HTTPException(status_code=400, detail="Duplicate subject IDs are not allowed.")

    subjects = db.scalars(select(Subject).where(Subject.id.in_(subject_ids))).all()
    subjects_by_id = {subject.id: subject for subject in subjects}
    if len(subjects_by_id) != len(subject_ids):
        raise HTTPException(status_code=400, detail="One or more subject IDs are invalid.")

    db.execute(delete(UserSubject).where(UserSubject.user_id == current_user.id))
    db.flush()

    for item in data.subjects:
        db.add(
            UserSubject(
                user_id=current_user.id,
                subject_id=item.subject_id,
                score=item.score,
            )
        )

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Could not update subjects.")

    db.expire(current_user, ["subjects"])
    return build_scores_response(current_user)
