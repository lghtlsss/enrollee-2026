from fastapi import FastAPI

from app.routers import auth_router
from app.routers import user_router

app = FastAPI(title="Enrollee-2026")

app.include_router(auth_router)
app.include_router(user_router)
