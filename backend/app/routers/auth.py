from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.schemas import SUserResponse, SUserCreate, SLogin
from backend.app.models import User
from backend.app.password_security import hash_password
from backend.app.database import get_db
from backend.app.password_security import verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post('/register', response_model=SUserResponse)
def register(user: SUserCreate, db=Depends(get_db)):
    """
    Register a new user.
    """
    user_exists = db.execute(select(User).where(User.email == user.email)).scalar_one_or_none()
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        name=user.name,
        surname=user.surname
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post('/login')
def login(credentials: SLogin, db: Session = Depends(get_db)):
    """
    Login a user.
    """
    user = db.execute(select(User).where(User.email == credentials.email)).scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful"}
