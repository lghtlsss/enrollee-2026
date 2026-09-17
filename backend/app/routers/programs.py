from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import programs as programs_service
from app.schemas.s_program import ProgramListResponse, ProgramDetail

router = APIRouter(prefix="/programs", tags=["Programs"])


@router.get("", response_model=ProgramListResponse)
def list_programs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    direction_id: int | None = Query(None),
    university_id: int | None = Query(None),
    db: Session = Depends(get_db),
):
    """
    Возвращает список программ обучения с возможностью фильтрации по направлению и университету, а также пагинацией.
    """
    items, total = programs_service.get_programs(db, skip, limit, direction_id, university_id)
    return ProgramListResponse(total=total, items=items)


@router.get("/{program_id}", response_model=ProgramDetail)
def get_program(program_id: int, db: Session = Depends(get_db)):
    """
    Возвращает информацию о конкретной программе обучения.
    """
    program = programs_service.get_program_by_id(db, program_id)
    if program is None:
        raise HTTPException(status_code=404, detail="Program not found")
    return programs_service.build_program_detail_dict(program)