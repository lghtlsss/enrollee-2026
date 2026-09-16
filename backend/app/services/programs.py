from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload

from app.models import Program, ProgramSubject


def get_programs(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    direction_id: Optional[int] = None,
    university_id: Optional[int] = None,
) -> tuple[list[Program], int]:
    query = select(Program)

    if direction_id is not None:
        query = query.where(Program.direction_id == direction_id)
    if university_id is not None:
        query = query.where(Program.university_id == university_id)

    total = db.scalar(select(func.count()).select_from(query.subquery()))

    query = query.order_by(Program.id).offset(skip).limit(limit)
    items = db.execute(query).scalars().all()

    return items, total


def get_program_by_id(db: Session, program_id: int) -> Optional[Program]:
    query = (
        select(Program)
        .where(Program.id == program_id)
        .options(
            joinedload(Program.university),
            joinedload(Program.direction),
            joinedload(Program.admission_records),
            joinedload(Program.subject_links).joinedload(ProgramSubject.subject),
        )
    )
    return db.execute(query).unique().scalar_one_or_none()


def build_program_detail_dict(program: Program) -> dict:
    """Собирает subjects вручную, т.к. это ProgramSubject + вложенный Subject.name, а не плоская модель."""
    return {
        "id": program.id,
        "name": program.name,
        "description": program.description,
        "university": program.university,
        "direction": program.direction,
        "admission_records": program.admission_records,
        "subjects": [
            {"id": link.subject.id, "name": link.subject.name, "is_required": link.is_required}
            for link in program.subject_links
        ],
    }