from datetime import datetime

from sqlalchemy import String, Text, Float, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    has_dormitory: Mapped[str] = mapped_column(Boolean, nullable=False, default=False)
    website: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    programs: Mapped[list["Program"]] = relationship(
        back_populates="university", cascade="all, delete-orphan"
    )
    vibe: Mapped["UniversityVibe | None"] = relationship(
        back_populates="university", uselist=False, cascade="all, delete-orphan"
    )
