from fastapi import FastAPI

from app.schemas import SInputPoints

from app.routers import auth_router
from app.routers import user_router

app = FastAPI(title="Enrollee-2026")

app.include_router(auth_router)
app.include_router(user_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to Enrollee-2026 API!"}


@app.post("/")
def get_points(input_points: SInputPoints):
    """
    Get the points from the input data.
    """
    pass
