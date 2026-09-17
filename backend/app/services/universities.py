from typing import Literal

from sqlalchemy import select, func, asc, desc
from sqlalchemy.orm import Session, joinedload

from app.models import University

SortBy = Literal["rating", "name", "city"]
SortOrder = Literal["asc", "desc"]

_SORTABLE_COLUMNS = {
    "rating": University.rating,
    "name": University.name,
    "city": University.city,
}


def get_universities(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    city: str | None = None,
    search: str | None = None,
    sort_by: SortBy = "rating",
    order: SortOrder = "desc",
) -> tuple[list[University], int]:
    query = select(University)

    if city:
        query = query.where(University.city.ilike(f"%{city}%"))
    if search:
        query = query.where(University.name.ilike(f"%{search}%"))

    total = db.scalar(select(func.count()).select_from(query.subquery()))

    column = _SORTABLE_COLUMNS[sort_by]
    direction = desc if order == "desc" else asc
    # nulls_last актуален только для rating (nullable-поле); для name/city он не влияет
    query = query.order_by(direction(column).nulls_last())

    query = query.offset(skip).limit(limit)
    items = db.execute(query).scalars().all()

    return items, total


def get_university_by_id(db: Session, university_id: int) -> University | None:
    query = (
        select(University)
        .where(University.id == university_id)
        .options(
            joinedload(University.vibe),
            joinedload(University.programs),
        )
    )
    return db.execute(query).unique().scalar_one_or_none()


def get_university_vibe(db: Session, university_id: int) -> University | None:
    """Возвращает University с подгруженным vibe, либо None если вуза нет."""
    query = (
        select(University)
        .where(University.id == university_id)
        .options(joinedload(University.vibe))
    )
    return db.execute(query).unique().scalar_one_or_none()
