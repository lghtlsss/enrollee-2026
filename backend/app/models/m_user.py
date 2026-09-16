from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Boolean

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(unique=True, )
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )
    surname: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    city: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )

    field_of_study: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )

    fee: Mapped[bool] = mapped_column(Boolean, default=True)

    subjects: Mapped[list["UserSubject"]] = relationship(
        back_populates="user"
    )
