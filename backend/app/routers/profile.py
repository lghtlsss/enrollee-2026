from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas import SProfileResponse, SSubjectsScoresResponse, SProfileUpdate
from app.dependencies import get_current_user
from app.database import get_db

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=SProfileResponse)
def get_profile(current_user=Depends(get_current_user)):
    """
    Возвращает профиль абитуриента(то есть не данные пользователя, а именно то что важно при расчете вузов)
    """
    return current_user


@router.get("/scores", response_model=SSubjectsScoresResponse)
def get_subjects_scores(current_user=Depends(get_current_user)):
    """
    Возвращает баллы абитуриента по предметам
    """
    return current_user


@router.patch("/update", response_model=SProfileResponse)
def update_profile(profile_data: SProfileUpdate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Обновляет профиль абитуриента
    """
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)
    return current_user
