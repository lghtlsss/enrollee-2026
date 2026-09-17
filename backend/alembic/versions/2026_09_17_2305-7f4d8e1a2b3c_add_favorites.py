"""Add favorites.

Revision ID: 7f4d8e1a2b3c
Revises: 55f0c5b4c44c
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7f4d8e1a2b3c"
down_revision: Union[str, Sequence[str], None] = "b2664a089015"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "favorites",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("university_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["university_id"], ["universities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "university_id"),
    )


def downgrade() -> None:
    op.drop_table("favorites")
