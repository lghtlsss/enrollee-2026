from pydantic import BaseModel
from datetime import datetime


class SReviewCreate(BaseModel):
    uni_id: int
    rating: float
    text: str
    tags: list[str]


class SReviewResponse(BaseModel):
    id: int
    author: str
    text: str
    rating: float
    tags: list[str]
    created_at: datetime
