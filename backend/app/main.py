from fastapi import FastAPI

from app.schemas import SInputPoints

from app.routers import universities_router, directions_router, programs_router, recommendations_router, user_router, \
    auth_router, subjects_router

app = FastAPI(title="Enrollee-2026")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(universities_router)
app.include_router(directions_router)
app.include_router(programs_router)
app.include_router(recommendations_router)
app.include_router(subjects_router)


@app.get("/")
def health_check():
    return {"message": "Welcome to Enrollee-2026 API!"}


@app.post("/")
def get_points(input_points: SInputPoints):
    """
    Get the points from the input data.
    """
    pass
