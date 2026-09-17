from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.database import get_db
from app.schemas import SUserResponse, SUserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=SUserResponse)
def get_me(current_user=Depends(get_current_user)):
    """
    Получить информацию о текущем пользователе.
    """
    return current_user


@router.delete("/me")
def delete_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Удалить аккаунт текущего пользователя.
    """
    db.delete(current_user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.patch("/me", response_model=SUserResponse)
def update_me(data: SUserUpdate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Обновить информацию о текущем пользователе.
    """
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user
