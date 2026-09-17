"""Restore the missing migration revision.

Revision ID: b2664a089015
Revises: 55f0c5b4c44c
"""

from typing import Sequence, Union


revision: str = "b2664a089015"
down_revision: Union[str, Sequence[str], None] = "55f0c5b4c44c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
