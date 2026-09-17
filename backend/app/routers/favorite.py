from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Favorite, University
from app.schemas import UniversityShort

router = APIRouter(prefix="/favorites", tags=["Favorites"])


def get_user_favorites(user_id: int, db: Session) -> list[University]:
    return list(
        db.scalars(
            select(University)
            .join(Favorite, Favorite.university_id == University.id)
            .where(Favorite.user_id == user_id)
            .order_by(University.id)
        ).all()
    )


@router.get("", response_model=list[UniversityShort])
def list_favorites(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_favorites(current_user.id, db)


@router.post("/{university_id}", response_model=list[UniversityShort])
def add_favorite(
    university_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    university = db.get(University, university_id)
    if university is None:
        raise HTTPException(status_code=404, detail="University not found")

    favorite = db.get(Favorite, (current_user.id, university_id))
    if favorite is None:
        db.add(Favorite(user_id=current_user.id, university_id=university_id))
        db.commit()

    return get_user_favorites(current_user.id, db)


@router.delete("/{university_id}", response_model=list[UniversityShort])
def remove_favorite(
    university_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = db.get(Favorite, (current_user.id, university_id))
    if favorite is not None:
        db.delete(favorite)
        db.commit()

    return get_user_favorites(current_user.id, db)
