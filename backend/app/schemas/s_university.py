from pydantic import BaseModel, ConfigDict

from app.schemas.s_program import ProgramShort

class UniversityVibeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    education: float | None = None
    career: float | None = None
    student_life: float | None = None
    atmosphere: float | None = None
    workload: float | None = None


class UniversityShort(BaseModel):
    """Для списка GET /universities — без вложенных программ."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str
    has_dormitory: bool
    rating: float | None = None


class UniversityDetail(BaseModel):
    """Для GET /universities/{id} — полная карточка."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    city: str
    has_dormitory: bool
    website: str | None = None
    rating: float | None = None
    vibe: UniversityVibeResponse | None = None
    programs: list[ProgramShort] = []


class UniversityListResponse(BaseModel):
    total: int
    items: list[UniversityShort]