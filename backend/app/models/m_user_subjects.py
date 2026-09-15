from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, CheckConstraint, UniqueConstraint
from app.database import Base


class UserSubject(Base):
    __tablename__ = "user_subjects"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"))
    score: Mapped[int] = mapped_column(nullable=False)

    __table_args__ = (
        CheckConstraint("score BETWEEN 0 AND 100", name="check_score_range"),
        UniqueConstraint("user_id", "subject_id", name="unique_user_subject"),
    )
