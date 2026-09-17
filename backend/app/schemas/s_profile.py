from pydantic import BaseModel, Field


class SSubjectScoreResponse(BaseModel):
    subject_id: int
    subject_name: str
    score: int


class SProfileResponse(BaseModel):
    id: int
    city: str | None = None
    field_of_study: str | None = None
    wants_budget: bool = True
    needs_dormitory: bool = False
    subjects: list[SSubjectScoreResponse]


class SSubjectsAllScoresResponse(BaseModel):
    subjects: list[SSubjectScoreResponse]


class SSubjectScoreInput(BaseModel):
    subject_id: int
    score: int = Field(ge=0, le=100)


class SUpdateSubjectsAndScores(BaseModel):
    subjects: list[SSubjectScoreInput]


class SProfileUpdate(BaseModel):
    city: str | None = None
    field_of_study: str | None = None
    wants_budget: bool | None = None
    needs_dormitory: bool | None = None
