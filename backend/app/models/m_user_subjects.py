from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, CheckConstraint, UniqueConstraint
from app.database import Base


class UserSubject(Base):
    __tablename__ = "user_subjects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    user_id: Mapped[int] = mapped_column(ForeignKey(
        "users.id",
        ondelete="CASCADE",
        name="fk_user_subjects_user_id"),
        nullable=False
    )

    subject_id: Mapped[int] = mapped_column(ForeignKey(
        "subjects.id",
        ondelete="RESTRICT",
        name="fk_user_subjects_subject_id"),
        nullable=False
    )

    score: Mapped[int] = mapped_column(nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="subjects")
    subject: Mapped["Subject"] = relationship()

    __table_args__ = (
        CheckConstraint("score BETWEEN 0 AND 100", name="check_score_range"),
        UniqueConstraint("user_id", "subject_id", name="unique_user_subject"),
    )
