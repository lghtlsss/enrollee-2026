from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Direction


def get_directions(db: Session) -> list[Direction]:
    return db.execute(select(Direction).order_by(Direction.name)).scalars().all()
