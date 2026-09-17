from pydantic import BaseModel


class SProfileResponse(BaseModel):
    id: int
    city: str | None
    field_of_study: str | None
    wants_budget: bool = True
    needs_dormitory: bool = False
    subjects: list[str]


class SSubjectsScoresResponse(BaseModel):
    subjects: list[str]


class SProfileUpdate(BaseModel):
    city: str | None
    field_of_study: str | None
    wants_budget: bool | None
    needs_dormitory: bool | None
