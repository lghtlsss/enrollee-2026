from pydantic import BaseModel, Field
from datetime import datetime


class SReviewCreate(BaseModel):
    uni_id: int
    rating: float = Field(ge=1, le=5, multiple_of=0.5)
    text: str
    tags: list[str] = Field(default_factory=list)


class SReviewResponse(BaseModel):
    id: int
    author: str
    text: str
    rating: float
    tags: list[str]
    created_at: datetime
