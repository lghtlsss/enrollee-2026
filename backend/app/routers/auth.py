from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy import select
from sqlalchemy.orm import Session

from datetime import datetime, timedelta, timezone

from app.config import settings

from app.schemas import SUserResponse, SUserCreate, SLogin
from app.models import User
from app.password_security import hash_password
from app.database import get_db
from app.password_security import verify_password

router = APIRouter(prefix="/auth", tags=["Authentication"])


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_access_token_expire_minutes)

    payload = {
        "sub": str(user_id),
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )


@router.post('/register', response_model=SUserResponse)
def register(user: SUserCreate, db=Depends(get_db)):
    """
    Регистрирует нового пользователя в системе.
    Проверяет, существует ли уже пользователь с указанным email.
    Если пользователь существует, возвращает ошибку 400.
    Если нет, создает нового пользователя с хэшированным паролем и сохраняет его в базе данных.
    Возвращает данные нового пользователя.
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
def login(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Вход пользователя в систему. Проверяет, существует ли пользователь с указанным email и совпадает ли пароль.
    """
    user = db.execute(select(User).where(User.email == credentials.username)).scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(user.id)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
