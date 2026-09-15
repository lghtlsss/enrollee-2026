from fastapi import FastAPI

from backend.app.routers import auth_router

app = FastAPI(title="Enrollee-2026")

app.include_router(auth_router)
