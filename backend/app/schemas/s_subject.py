from pydantic import BaseModel


class SSubjectResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }
