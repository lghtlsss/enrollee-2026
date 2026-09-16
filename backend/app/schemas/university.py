from typing import Optional
from pydantic import BaseModel, ConfigDict

from app.schemas.program import ProgramShort  # noqa: E402

class UniversityVibeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    education: Optional[float] = None
    career: Optional[float] = None
    student_life: Optional[float] = None
    atmosphere: Optional[float] = None
    workload: Optional[float] = None


class UniversityShort(BaseModel):
    """Для списка GET /universities — без вложенных программ."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    rating: Optional[float] = None


class UniversityDetail(BaseModel):
    """Для GET /universities/{id} — полная карточка."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    city: str
    website: Optional[str] = None
    rating: Optional[float] = None
    vibe: Optional[UniversityVibeResponse] = None
    programs: list["ProgramShort"] = []


class UniversityListResponse(BaseModel):
    total: int
    items: list[UniversityShort]

UniversityDetail.model_rebuild()
