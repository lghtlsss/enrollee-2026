from decimal import Decimal

from pydantic import BaseModel, ConfigDict

class AdmissionRecordResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year: int
    passing_score: int | None = None
    budget_places: int | None = None
    tuition_cost: Decimal | None = None
