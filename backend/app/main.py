from fastapi import FastAPI

from app.routers import universities, directions, programs, recommendations

app = FastAPI(title="Abiturient Service — University Domain")

app.include_router(universities.router)
app.include_router(directions.router)
app.include_router(programs.router)
app.include_router(recommendations.router)

