from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload

from app.models import University


def get_universities(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    city: Optional[str] = None,
    search: Optional[str] = None,
) -> tuple[list[University], int]:
    query = select(University)

    if city:
        query = query.where(University.city.ilike(f"%{city}%"))
    if search:
        query = query.where(University.name.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))

    query = query.order_by(University.rating.desc().nulls_last()).offset(skip).limit(limit)
    items = db.execute(query).scalars().all()

    return items, total


def get_university_by_id(db: Session, university_id: int) -> Optional[University]:
    query = (
        select(University)
        .where(University.id == university_id)
        .options(
            joinedload(University.vibe),
            joinedload(University.programs),
        )
    )
    return db.execute(query).unique().scalar_one_or_none()

def get_university_vibe(db: Session, university_id: int) -> Optional[University]:
    """Возвращает University с подгруженным vibe, либо None если вуза нет."""
    query = (
        select(University)
        .where(University.id == university_id)
        .options(joinedload(University.vibe))
    )
    return db.execute(query).unique().scalar_one_or_none()

