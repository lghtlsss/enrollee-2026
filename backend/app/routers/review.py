from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db

from app.models import Review, University
from app.schemas import SReviewCreate, SReviewResponse

from app.dependencies import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/{university_id}", response_model=list[SReviewResponse])
def get_reviews(university_id: int, db: Session = Depends(get_db)):
    reviews = db.execute(select(Review).where(Review.uni_id == university_id)).scalars().all()
    return [
        {
            "id": review.id,
            "author": review.author,
            "text": review.text or "",
            "rating": review.rating,
            "tags": review.tags or [],
            "created_at": review.created_at,
        }
        for review in reviews
    ]


@router.post("/create_review", response_model=SReviewResponse)
def create_review(review: SReviewCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    university = db.execute(
        select(University).where(University.id == review.uni_id)
    ).scalar_one_or_none()
    if university is None:
        raise HTTPException(status_code=404, detail="University not found")

    new_review = Review(
        user_id=current_user.id,
        author=current_user.name + " " + current_user.surname,
        uni_id=review.uni_id,
        rating=review.rating,
        text=review.text,
        tags=review.tags,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
