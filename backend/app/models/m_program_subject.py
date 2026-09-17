from sqlalchemy import ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProgramSubject(Base):
    __tablename__ = "program_subjects"
    __table_args__ = (
        UniqueConstraint("program_id", "subject_id", name="uq_program_subject"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    program_id: Mapped[int] = mapped_column(
        ForeignKey("programs.id", ondelete="CASCADE", name="fk_program_subjects_program_id"), nullable=False, index=True
    )
    subject_id: Mapped[int] = mapped_column(
        ForeignKey("subjects.id", ondelete="RESTRICT", name="fk_program_subjects_subject_id"), nullable=False, index=True
    )
    is_required: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    program: Mapped["Program"] = relationship(back_populates="subject_links")
    subject: Mapped["Subject"] = relationship(back_populates="program_links")