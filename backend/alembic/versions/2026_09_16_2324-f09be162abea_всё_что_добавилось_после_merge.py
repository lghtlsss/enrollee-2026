"""Всё что добавилось после merge

Revision ID: f09be162abea
Revises: c327b0f87c00
Create Date: 2026-09-16 23:24:39.741363

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f09be162abea"
down_revision: Union[str, Sequence[str], None] = "c327b0f87c00"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # =========================
    # directions
    # =========================

    op.create_table(
        "directions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_directions_name",
        "directions",
        ["name"],
        unique=True,
    )

    # =========================
    # universities
    # =========================

    op.create_table(
        "universities",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("website", sa.String(length=255), nullable=True),
        sa.Column("rating", sa.Float(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_universities_city",
        "universities",
        ["city"],
        unique=False,
    )

    op.create_index(
        "ix_universities_name",
        "universities",
        ["name"],
        unique=True,
    )

    # =========================
    # programs
    # =========================

    op.create_table(
        "programs",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column(
            "university_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "direction_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "name",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["university_id"],
            ["universities.id"],
            name="fk_programs_university_id",
            ondelete="CASCADE",
        ),

        sa.ForeignKeyConstraint(
            ["direction_id"],
            ["directions.id"],
            name="fk_programs_direction_id",
            ondelete="RESTRICT",
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint(
            "university_id",
            "name",
            name="uq_program_university_name",
        ),
    )

    op.create_index(
        "ix_programs_university_id",
        "programs",
        ["university_id"],
        unique=False,
    )

    op.create_index(
        "ix_programs_direction_id",
        "programs",
        ["direction_id"],
        unique=False,
    )

    # =========================
    # university_vibes
    # =========================

    op.create_table(
        "university_vibes",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column(
            "university_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column("education", sa.Float(), nullable=True),
        sa.Column("career", sa.Float(), nullable=True),
        sa.Column("student_life", sa.Float(), nullable=True),
        sa.Column("atmosphere", sa.Float(), nullable=True),
        sa.Column("workload", sa.Float(), nullable=True),

        sa.ForeignKeyConstraint(
            ["university_id"],
            ["universities.id"],
            name="fk_university_vibes_university_id",
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint("university_id"),
    )

    # =========================
    # admission_records
    # =========================

    op.create_table(
        "admission_records",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column(
            "program_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "year",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "passing_score",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "budget_places",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "tuition_cost",
            sa.Numeric(precision=10, scale=2),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["program_id"],
            ["programs.id"],
            name="fk_admission_records_program_id",
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint(
            "program_id",
            "year",
            name="uq_admission_program_year",
        ),
    )

    op.create_index(
        "ix_admission_records_program_id",
        "admission_records",
        ["program_id"],
        unique=False,
    )

    op.create_index(
        "ix_admission_records_year",
        "admission_records",
        ["year"],
        unique=False,
    )

    # =========================
    # program_subjects
    # =========================

    op.create_table(
        "program_subjects",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column(
            "program_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "subject_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "is_required",
            sa.Boolean(),
            nullable=False,
        ),

        sa.ForeignKeyConstraint(
            ["program_id"],
            ["programs.id"],
            name="fk_program_subjects_program_id",
            ondelete="CASCADE",
        ),

        sa.ForeignKeyConstraint(
            ["subject_id"],
            ["subjects.id"],
            name="fk_program_subjects_subject_id",
            ondelete="RESTRICT",
        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint(
            "program_id",
            "subject_id",
            name="uq_program_subject",
        ),
    )

    op.create_index(
        "ix_program_subjects_program_id",
        "program_subjects",
        ["program_id"],
        unique=False,
    )

    op.create_index(
        "ix_program_subjects_subject_id",
        "program_subjects",
        ["subject_id"],
        unique=False,
    )

    # =========================
    # subjects
    # =========================

    op.create_index(
        "ix_subjects_name",
        "subjects",
        ["name"],
        unique=True,
    )

    # =========================
    # user_subjects
    # =========================

    # Старые FK, созданные PostgreSQL автоматически.
    op.drop_constraint(
        "user_subjects_user_id_fkey",
        "user_subjects",
        type_="foreignkey",
    )

    op.drop_constraint(
        "user_subjects_subject_id_fkey",
        "user_subjects",
        type_="foreignkey",
    )

    # Новые FK с именами и ON DELETE.
    op.create_foreign_key(
        "fk_user_subjects_user_id",
        "user_subjects",
        "users",
        ["user_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "fk_user_subjects_subject_id",
        "user_subjects",
        "subjects",
        ["subject_id"],
        ["id"],
        ondelete="RESTRICT",
    )


def downgrade() -> None:
    """Downgrade schema."""

    # =========================
    # user_subjects
    # =========================

    op.drop_constraint(
        "fk_user_subjects_user_id",
        "user_subjects",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_user_subjects_subject_id",
        "user_subjects",
        type_="foreignkey",
    )

    # Возвращаем старые FK без ON DELETE.
    op.create_foreign_key(
        "user_subjects_user_id_fkey",
        "user_subjects",
        "users",
        ["user_id"],
        ["id"],
    )

    op.create_foreign_key(
        "user_subjects_subject_id_fkey",
        "user_subjects",
        "subjects",
        ["subject_id"],
        ["id"],
    )

    # =========================
    # subjects
    # =========================

    op.drop_index(
        "ix_subjects_name",
        table_name="subjects",
    )

    # =========================
    # program_subjects
    # =========================

    op.drop_index(
        "ix_program_subjects_subject_id",
        table_name="program_subjects",
    )

    op.drop_index(
        "ix_program_subjects_program_id",
        table_name="program_subjects",
    )

    op.drop_table("program_subjects")

    # =========================
    # admission_records
    # =========================

    op.drop_index(
        "ix_admission_records_year",
        table_name="admission_records",
    )

    op.drop_index(
        "ix_admission_records_program_id",
        table_name="admission_records",
    )

    op.drop_table("admission_records")

    # =========================
    # university_vibes
    # =========================

    op.drop_table("university_vibes")

    # =========================
    # programs
    # =========================

    op.drop_index(
        "ix_programs_direction_id",
        table_name="programs",
    )

    op.drop_index(
        "ix_programs_university_id",
        table_name="programs",
    )

    op.drop_table("programs")

    # =========================
    # universities
    # =========================

    op.drop_index(
        "ix_universities_name",
        table_name="universities",
    )

    op.drop_index(
        "ix_universities_city",
        table_name="universities",
    )

    op.drop_table("universities")

    # =========================
    # directions
    # =========================

    op.drop_index(
        "ix_directions_name",
        table_name="directions",
    )

    op.drop_table("directions")