from typing import Optional

from sqlalchemy import String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Program(Base):
    __tablename__ = "programs"
    __table_args__ = (
        UniqueConstraint("university_id", "name", name="uq_program_university_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    university_id: Mapped[int] = mapped_column(
        ForeignKey("universities.id", ondelete="CASCADE", name="fk_programs_university_id"), nullable=False, index=True
    )
    direction_id: Mapped[int] = mapped_column(
        ForeignKey("directions.id", ondelete="RESTRICT", name="fk_programs_direction_id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    university: Mapped["University"] = relationship(back_populates="programs")
    direction: Mapped["Direction"] = relationship(back_populates="programs")

    subject_links: Mapped[list["ProgramSubject"]] = relationship(
        back_populates="program", cascade="all, delete-orphan"
    )
    admission_records: Mapped[list["AdmissionRecord"]] = relationship(
        back_populates="program", cascade="all, delete-orphan"
    )