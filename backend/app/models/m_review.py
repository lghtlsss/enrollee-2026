from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float, String, JSON

from datetime import datetime
from app.database import Base


class Review(Base):
    """Отзывы о программах"""
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    author: Mapped[str] = mapped_column(String(100), nullable=False)
    uni_id: Mapped[int] = mapped_column(ForeignKey("universities.id", ondelete="CASCADE"), nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    text: Mapped[str] = mapped_column(String(300), nullable=True)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(default=datetime.now)

    user: Mapped["User"] = relationship(back_populates="reviews")
    university: Mapped["University"] = relationship(back_populates="reviews")
