from typing import Optional
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class AdmissionRecord(Base):
    """Связь программы, вуза и проходного балла"""
    __tablename__ = "admission_records"
    __table_args__ = (
        UniqueConstraint("program_id", "year", name="uq_admission_program_year"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(
        ForeignKey("programs.id", ondelete="CASCADE", name="fk_admission_records_program_id"), nullable=False, index=True
    )
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    passing_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    budget_places: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    tuition_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)

    program: Mapped["Program"] = relationship(back_populates="admission_records")