from pydantic import BaseModel


class SUserCreate(BaseModel):
    name: str
    surname: str
    email: str
    password: str


class SUserResponse(BaseModel):
    name: str
    surname: str
    email: str

    model_config = {
        "from_attributes": True
    }


class SUserUpdate(BaseModel):
    name: str | None = None
    surname: str | None = None


class SInputPoints(BaseModel):
    russian_language: int | None = None
    mathematics: int | None = None
    informatics: int | None = None
    biology: int | None = None
    chemistry: int | None = None
    literature: int | None = None
    physics: int | None = None
    social_science: int | None = None
    english_language: int | None = None
