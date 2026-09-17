from typing import Literal

from pydantic import BaseModel, Field

Chance = Literal["high", "medium", "low", "unknown"]

class RecommendationRequest(BaseModel):
    scores: dict[str, int] = Field(
        ..., description="Баллы пользователя: имя предмета -> балл, напр. {'russian': 82, 'math': 78}"
    )
    direction_id: int | None = None
    city: str | None = None
    budget_only: bool = False

class RecommendationItem(BaseModel):
    university_id: int
    university_name: str
    program_id: int
    program_name: str
    user_total: int
    passing_score: int | None = None
    budget_places: int | None = None
    tuition_cost: float | None = None
    chance: Chance

class RecommendationResponse(BaseModel):
    total: int
    items: list[RecommendationItem]