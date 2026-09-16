from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class AdmissionRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year: int
    passing_score: Optional[int] = None
    budget_places: Optional[int] = None
    tuition_cost: Optional[Decimal] = None