from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class AdmissionRecord(Base):
    __tablename__ = "admission_records"
    __table_args__ = (
        UniqueConstraint("program_id", "year", name="uq_admission_program_year"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(
        ForeignKey("programs.id", ondelete="CASCADE"), nullable=False, index=True
    )
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)

    passing_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    budget_places: Mapped[int | None] = mapped_column(Integer, nullable=True)
    tuition_cost: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    program: Mapped["Program"] = relationship(back_populates="admission_records")
