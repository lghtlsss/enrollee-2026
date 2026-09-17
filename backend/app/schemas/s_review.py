from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class SReviewCreate(BaseModel):
    uni_id: int
    rating: float = Field(ge=1, le=5)
    text: str
    tags: list[str] = Field(default_factory=list)


class SReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    author: str
    text: str
    rating: float
    tags: list[str]
    created_at: datetime
