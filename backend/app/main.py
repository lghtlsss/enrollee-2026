from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    universities_router, directions_router, programs_router, recommendations_router,
    user_router, auth_router, subjects_router, profile_router, review_router, favorite_router)

app = FastAPI(title="Enrollee-2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "https://frontend-artem-6147.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(universities_router)
app.include_router(directions_router)
app.include_router(programs_router)
app.include_router(recommendations_router)
app.include_router(subjects_router)
app.include_router(profile_router)
app.include_router(review_router)
app.include_router(favorite_router)


@app.get("/")
def health_check():
    return {"message": "Welcome to Enrollee-2026 API!"}
