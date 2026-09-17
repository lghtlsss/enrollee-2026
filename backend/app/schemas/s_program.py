from typing import Optional
from pydantic import BaseModel, ConfigDict

from .s_direction import DirectionResponse
from .s_admission import AdmissionRecordResponse


class ProgramShort(BaseModel):
    """Для вложения в UniversityDetail — краткая карточка программы."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    direction_id: int


class SubjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    is_required: bool


class UniversityBrief(BaseModel):
    """Краткая инфа о вузе для вложения в карточку программы."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str


class ProgramDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    university: UniversityBrief
    direction: DirectionResponse
    subjects: list[SubjectResponse] = []
    admission_records: list[AdmissionRecordResponse] = []


class ProgramListResponse(BaseModel):
    total: int
    items: list[ProgramShort]
