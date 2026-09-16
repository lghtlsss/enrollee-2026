from typing import Optional, Literal
from pydantic import BaseModel, Field

Chance = Literal["high", "medium", "low", "unknown"]


class RecommendationRequest(BaseModel):
    scores: dict[str, int] = Field(
        ..., description="Баллы пользователя: имя предмета -> балл, напр. {'russian': 82, 'math': 78}"
    )
    direction_id: Optional[int] = None
    city: Optional[str] = None
    budget_only: bool = False


class RecommendationItem(BaseModel):
    university_id: int
    university_name: str
    program_id: int
    program_name: str
    user_total: int
    passing_score: Optional[int] = None
    budget_places: Optional[int] = None
    tuition_cost: Optional[float] = None
    chance: Chance


class RecommendationResponse(BaseModel):
    total: int
    items: list[RecommendationItem]