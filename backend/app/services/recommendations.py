from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Program, ProgramSubject, AdmissionRecord
from app.schemas.s_recommendation import RecommendationRequest, RecommendationItem, Chance

MEDIUM_THRESHOLD = 10
LOW_THRESHOLD = 25


def _latest_admission_record(program: Program) -> Optional[AdmissionRecord]:
    if not program.admission_records:
        return None
    return max(program.admission_records, key=lambda r: r.year)


def _compute_chance(user_total: int, passing_score: Optional[int]) -> Chance:
    if passing_score is None:
        return "unknown"
    diff = user_total - passing_score
    if diff >= 0:
        return "high"
    if diff >= -MEDIUM_THRESHOLD:
        return "medium"
    if diff >= -LOW_THRESHOLD:
        return "low"
    return None  # программа не проходит порог — обрабатывается вызывающим кодом


def _fetch_candidate_programs(
    db: Session, direction_id: Optional[int], city: Optional[str]
) -> list[Program]:
    query = select(Program).options(
        joinedload(Program.university),
        joinedload(Program.admission_records),
        joinedload(Program.subject_links).joinedload(ProgramSubject.subject),
    )
    if direction_id is not None:
        query = query.where(Program.direction_id == direction_id)

    programs = db.execute(query).unique().scalars().all()

    if city is not None:
        programs = [p for p in programs if p.university.city.lower() == city.lower()]

    return programs


def get_recommendations(
    db: Session, request: RecommendationRequest
) -> tuple[list[RecommendationItem], int]:
    programs = _fetch_candidate_programs(db, request.direction_id, request.city)

    results: list[RecommendationItem] = []

    for program in programs:
        record = _latest_admission_record(program)
        if record is None:
            continue  # нет данных о поступлении — не можем оценить

        if request.budget_only and not record.budget_places:
            continue

        required_subjects = [
            link.subject.name for link in program.subject_links if link.is_required
        ]
        if not required_subjects:
            continue  # программа без заданных предметов — некорректные данные, пропускаем

        if not all(subj in request.scores for subj in required_subjects):
            continue  # у пользователя нет баллов по одному из обязательных предметов

        user_total = sum(request.scores[subj] for subj in required_subjects)

        chance = _compute_chance(user_total, record.passing_score)
        if chance is None:
            continue  # ниже порога low — не показываем вообще

        results.append(
            RecommendationItem(
                university_id=program.university.id,
                university_name=program.university.name,
                program_id=program.id,
                program_name=program.name,
                user_total=user_total,
                passing_score=record.passing_score,
                budget_places=record.budget_places,
                tuition_cost=float(record.tuition_cost) if record.tuition_cost else None,
                chance=chance,
            )
        )

    chance_order = {"high": 0, "medium": 1, "low": 2, "unknown": 3}
    results.sort(
        key=lambda item: (
            chance_order[item.chance],
            -(item.user_total - (item.passing_score or item.user_total)),
        )
    )

    return results, len(results)