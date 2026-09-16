from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import directions as directions_service
from app.schemas.direction import DirectionResponse

router = APIRouter(prefix="/directions", tags=["directions"])


@router.get("", response_model=list[DirectionResponse])
def list_directions(db: Session = Depends(get_db)):
    return directions_service.get_directions(db)