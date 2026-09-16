from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import universities as universities_service
from app.schemas.university import UniversityListResponse, UniversityDetail, UniversityVibeResponse


router = APIRouter(prefix="/universities", tags=["universities"])


@router.get("", response_model=UniversityListResponse)
def list_universities(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    city: str | None = Query(None),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
):
    items, total = universities_service.get_universities(db, skip, limit, city, search)
    return UniversityListResponse(total=total, items=items)


@router.get("/{university_id}", response_model=UniversityDetail)
def get_university(university_id: int, db: Session = Depends(get_db)):
    university = universities_service.get_university_by_id(db, university_id)
    if university is None:
        raise HTTPException(status_code=404, detail="University not found")
    return university

@router.get("/{university_id}/vibe", response_model=UniversityVibeResponse)
def get_university_vibe(university_id: int, db: Session = Depends(get_db)):
    university = universities_service.get_university_vibe(db, university_id)
    if university is None:
        raise HTTPException(status_code=404, detail="University not found")
    if university.vibe is None:
        raise HTTPException(status_code=404, detail="Vibe data not set for this university")
    return university.vibe
