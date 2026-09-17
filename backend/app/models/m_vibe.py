from sqlalchemy import ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class UniversityVibe(Base):
    __tablename__ = "university_vibes"

    id: Mapped[int] = mapped_column(primary_key=True)
    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    education: Mapped[float | None] = mapped_column(Float, nullable=True)
    career: Mapped[float | None] = mapped_column(Float, nullable=True)
    student_life: Mapped[float | None] = mapped_column(Float, nullable=True)
    atmosphere: Mapped[float | None] = mapped_column(Float, nullable=True)
    workload: Mapped[float | None] = mapped_column(Float, nullable=True)

    university: Mapped["University"] = relationship(back_populates="vibe")
