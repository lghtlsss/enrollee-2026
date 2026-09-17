from pydantic import BaseModel


class SLogin(BaseModel):
    email: str
    password: str
