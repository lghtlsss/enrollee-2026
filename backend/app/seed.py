import argparse
import random
from decimal import Decimal

from sqlalchemy import text

from app.database import SessionLocal
from app.models import (
    University,
    Direction,
    Subject,
    Program,
    ProgramSubject,
    AdmissionRecord,
    UniversityVibe,
)


random.seed(42)

def generate_has_dormitory() -> bool:
    return random.random() < 0.8


# ============================================================
# DATA
# ============================================================

UNIVERSITIES = [
    {
        "name": "НИУ ВШЭ",
        "description": "Национальный исследовательский университет с сильными направлениями в IT, экономике и социальных науках.",
        "city": "Москва",
        "website": "https://hse.ru",
        "category": "elite",
    },
    {
        "name": "Университет ИТМО",
        "description": "Технический университет с сильными направлениями в информационных технологиях, программировании и искусственном интеллекте.",
        "city": "Санкт-Петербург",
        "website": "https://itmo.ru",
        "category": "elite",
    },
    {
        "name": "МФТИ",
        "description": "Технический университет с фундаментальной подготовкой в математике, физике и компьютерных науках.",
        "city": "Долгопрудный",
        "website": "https://mipt.ru",
        "category": "elite",
    },
    {
        "name": "НИЯУ МИФИ",
        "description": "Национальный исследовательский ядерный университет с сильной инженерной и IT-подготовкой.",
        "city": "Москва",
        "website": "https://mephi.ru",
        "category": "elite",
    },
    {
        "name": "МГТУ им. Н.Э. Баумана",
        "description": "Крупный технический университет с инженерными и IT-программами.",
        "city": "Москва",
        "website": "https://bmstu.ru",
        "category": "elite",
    },
    {
        "name": "МГУ им. М.В. Ломоносова",
        "description": "Крупнейший классический университет России с сильной фундаментальной подготовкой.",
        "city": "Москва",
        "website": "https://msu.ru",
        "category": "elite",
    },
    {
        "name": "Университет Иннополис",
        "description": "Университет, специализирующийся на информационных технологиях, искусственном интеллекте и программировании.",
        "city": "Иннополис",
        "website": "https://innopolis.university",
        "category": "elite",
    },
    {
        "name": "РТУ МИРЭА",
        "description": "Российский технологический университет с большим количеством IT и инженерных программ.",
        "city": "Москва",
        "website": "https://mirea.ru",
        "category": "high",
    },
    {
        "name": "Московский авиационный институт",
        "description": "Технический университет с инженерными, авиационными и IT-направлениями.",
        "city": "Москва",
        "website": "https://mai.ru",
        "category": "high",
    },
    {
        "name": "РАНХиГС",
        "description": "Российская академия народного хозяйства и государственной службы.",
        "city": "Москва",
        "website": "https://ranepa.ru",
        "category": "high",
    },
    {
        "name": "Финансовый университет при Правительстве РФ",
        "description": "Крупный университет с сильными направлениями в экономике, финансах, бизнесе и IT.",
        "city": "Москва",
        "website": "https://fa.ru",
        "category": "high",
    },
    {
        "name": "РГУ нефти и газа им. И.М. Губкина",
        "description": "Ведущий университет нефтегазовой отрасли с инженерными и цифровыми направлениями.",
        "city": "Москва",
        "website": "https://gubkin.ru",
        "category": "high",
    },
    {
        "name": "МЭИ",
        "description": "Национальный исследовательский университет энергетики и инженерных технологий.",
        "city": "Москва",
        "website": "https://mpei.ru",
        "category": "high",
    },
    {
        "name": "СПбГУ",
        "description": "Классический университет Санкт-Петербурга с широким набором образовательных программ.",
        "city": "Санкт-Петербург",
        "website": "https://spbu.ru",
        "category": "high",
    },
    {
        "name": "СПбПУ Петра Великого",
        "description": "Крупный технический университет Санкт-Петербурга.",
        "city": "Санкт-Петербург",
        "website": "https://spbstu.ru",
        "category": "high",
    },
    {
        "name": "СПбГЭТУ ЛЭТИ",
        "description": "Технический университет с направлениями электроники, информационных технологий и программирования.",
        "city": "Санкт-Петербург",
        "website": "https://etu.ru",
        "category": "high",
    },
    {
        "name": "СПбГУТ им. М.А. Бонч-Бруевича",
        "description": "Университет телекоммуникаций и информационных технологий.",
        "city": "Санкт-Петербург",
        "website": "https://sut.ru",
        "category": "medium",
    },
    {
        "name": "Уральский федеральный университет",
        "description": "Крупный федеральный университет Екатеринбурга с техническими и IT-программами.",
        "city": "Екатеринбург",
        "website": "https://urfu.ru",
        "category": "high",
    },
    {
        "name": "Уральский государственный экономический университет",
        "description": "Университет с программами в экономике, бизнесе, управлении и информационных технологиях.",
        "city": "Екатеринбург",
        "website": "https://usue.ru",
        "category": "medium",
    },
    {
        "name": "Новосибирский государственный университет",
        "description": "Классический университет с сильной математической и естественно-научной подготовкой.",
        "city": "Новосибирск",
        "website": "https://nsu.ru",
        "category": "high",
    },
    {
        "name": "Новосибирский государственный технический университет",
        "description": "Крупный технический университет Сибири.",
        "city": "Новосибирск",
        "website": "https://nstu.ru",
        "category": "medium",
    },
    {
        "name": "Томский государственный университет",
        "description": "Классический исследовательский университет с сильными естественно-научными и IT-направлениями.",
        "city": "Томск",
        "website": "https://tsu.ru",
        "category": "high",
    },
    {
        "name": "Томский политехнический университет",
        "description": "Крупный технический университет с инженерными и цифровыми программами.",
        "city": "Томск",
        "website": "https://tpu.ru",
        "category": "high",
    },
    {
        "name": "Сибирский федеральный университет",
        "description": "Крупный университет Красноярска с техническими, IT и экономическими направлениями.",
        "city": "Красноярск",
        "website": "https://sfu.ru",
        "category": "medium",
    },
    {
        "name": "Южный федеральный университет",
        "description": "Крупный федеральный университет юга России.",
        "city": "Ростов-на-Дону",
        "website": "https://sfedu.ru",
        "category": "medium",
    },
    {
        "name": "Донской государственный технический университет",
        "description": "Крупный технический университет Ростовской области.",
        "city": "Ростов-на-Дону",
        "website": "https://donstu.ru",
        "category": "medium",
    },
    {
        "name": "Казанский федеральный университет",
        "description": "Крупный федеральный университет с широким спектром технических и экономических программ.",
        "city": "Казань",
        "website": "https://kpfu.ru",
        "category": "high",
    },
    {
        "name": "КНИТУ-КАИ им. А.Н. Туполева",
        "description": "Технический университет Казани с инженерными и IT-направлениями.",
        "city": "Казань",
        "website": "https://kai.ru",
        "category": "medium",
    },
    {
        "name": "Омский государственный технический университет",
        "description": "Крупный технический университет Омска.",
        "city": "Омск",
        "website": "https://omgtu.ru",
        "category": "medium",
    },
    {
        "name": "Самарский университет",
        "description": "Крупный университет с техническими, авиационными и IT-направлениями.",
        "city": "Самара",
        "website": "https://ssau.ru",
        "category": "high",
    },
    {
        "name": "ННГУ им. Н.И. Лобачевского",
        "description": "Крупный исследовательский университет Нижнего Новгорода.",
        "city": "Нижний Новгород",
        "website": "https://unn.ru",
        "category": "high",
    },
    {
        "name": "НГТУ им. Р.Е. Алексеева",
        "description": "Крупный технический университет Нижнего Новгорода.",
        "city": "Нижний Новгород",
        "website": "https://nntu.ru",
        "category": "medium",
    },
    {
        "name": "Пермский государственный университет",
        "description": "Классический университет с естественно-научными, техническими и экономическими программами.",
        "city": "Пермь",
        "website": "https://psu.ru",
        "category": "medium",
    },
    {
        "name": "Пермский политехнический университет",
        "description": "Крупный технический университет Пермского края.",
        "city": "Пермь",
        "website": "https://pstu.ru",
        "category": "medium",
    },
    {
        "name": "Воронежский государственный университет",
        "description": "Классический университет Центрального Черноземья.",
        "city": "Воронеж",
        "website": "https://vsu.ru",
        "category": "medium",
    },
    {
        "name": "Белгородский государственный национальный исследовательский университет",
        "description": "Крупный исследовательский университет Белгородской области.",
        "city": "Белгород",
        "website": "https://bsu.edu.ru",
        "category": "regional",
    },
    {
        "name": "Южно-Уральский государственный университет",
        "description": "Крупный технический университет Челябинска.",
        "city": "Челябинск",
        "website": "https://susu.ru",
        "category": "medium",
    },
    {
        "name": "Дальневосточный федеральный университет",
        "description": "Федеральный университет Владивостока с техническими, IT и бизнес-программами.",
        "city": "Владивосток",
        "website": "https://dvfu.ru",
        "category": "medium",
    },
    {
        "name": "Крымский федеральный университет",
        "description": "Крупный федеральный университет Крыма.",
        "city": "Симферополь",
        "website": "https://cfuv.ru",
        "category": "regional",
    },
]


PROGRAM_TEMPLATES = {
    "Computer Science": [
        "Компьютерные науки",
        "Информатика и вычислительная техника",
    ],
    "Software Engineering": [
        "Программная инженерия",
        "Разработка программных систем",
    ],
    "Data Science": [
        "Прикладная математика и информатика",
        "Анализ данных и искусственный интеллект",
    ],
    "Business Informatics": [
        "Бизнес-информатика",
        "Цифровой бизнес и информационные системы",
    ],
    "Applied Physics": [
        "Прикладная физика и информатика",
        "Техническая физика",
    ],
    "International Business": [
        "Международный бизнес",
        "Мировая экономика и международный бизнес",
    ],
}


PASSING_SCORE_RANGES = {
    "elite": {
        "Computer Science": (285, 300),
        "Software Engineering": (285, 300),
        "Data Science": (280, 300),
        "Business Informatics": (270, 295),
        "Applied Physics": (270, 295),
        "International Business": (265, 290),
    },
    "high": {
        "Computer Science": (255, 285),
        "Software Engineering": (255, 285),
        "Data Science": (250, 280),
        "Business Informatics": (245, 275),
        "Applied Physics": (245, 275),
        "International Business": (240, 270),
    },
    "medium": {
        "Computer Science": (220, 260),
        "Software Engineering": (220, 260),
        "Data Science": (215, 255),
        "Business Informatics": (210, 250),
        "Applied Physics": (210, 250),
        "International Business": (205, 245),
    },
    "regional": {
        "Computer Science": (180, 235),
        "Software Engineering": (180, 230),
        "Data Science": (175, 230),
        "Business Informatics": (170, 225),
        "Applied Physics": (170, 225),
        "International Business": (165, 220),
    },
}


# Какой набор ЕГЭ используется для каждого типа программы.
# Сделано намеренно разнообразным: Computer Science/Software Engineering/Data Science
# используют informatics, Business Informatics/International Business — social/english,
# Applied Physics — physics. Это даёт тестам реальные кейсы "у пользователя нет баллов
# по обязательному предмету программы" (например, нет physics или english).
PROGRAM_SUBJECTS = {
    "Computer Science": ["russian", "math", "informatics"],
    "Software Engineering": ["russian", "math", "informatics"],
    "Data Science": ["russian", "math", "informatics"],
    "Business Informatics": ["russian", "math", "social"],
    "Applied Physics": ["russian", "math", "physics"],
    "International Business": ["russian", "math", "english"],
}


# ============================================================
# HELPERS
# ============================================================

def get_passing_score(category: str, program_type: str) -> int:
    low, high = PASSING_SCORE_RANGES[category][program_type]
    return random.randint(low, high)


def get_budget_places(category: str) -> int | None:
    """
    Количество мест специально генерируется с разбросом,
    чтобы рекомендации можно было тестировать на разных данных.
    """

    if category == "elite":
        return random.randint(25, 100)

    if category == "high":
        return random.randint(30, 150)

    if category == "medium":
        return random.randint(40, 200)

    return random.randint(50, 250)


def get_tuition_cost(category: str) -> Decimal:
    if category == "elite":
        value = random.randint(550, 900) * 1000
    elif category == "high":
        value = random.randint(350, 650) * 1000
    elif category == "medium":
        value = random.randint(220, 450) * 1000
    else:
        value = random.randint(160, 320) * 1000

    return Decimal(f"{value}.00")


def get_university_rating(category: str) -> float:
    if category == "elite":
        return round(random.uniform(8.8, 9.8), 1)

    if category == "high":
        return round(random.uniform(8.0, 9.0), 1)

    if category == "medium":
        return round(random.uniform(7.0, 8.2), 1)

    return round(random.uniform(6.5, 7.5), 1)


def get_vibe(category: str) -> dict:
    if category == "elite":
        low, high = 8.2, 9.9
    elif category == "high":
        low, high = 7.6, 9.3
    elif category == "medium":
        low, high = 6.8, 8.6
    else:
        low, high = 6.0, 7.8

    return {
        "education": round(random.uniform(low, high), 1),
        "career": round(random.uniform(low, high), 1),
        "student_life": round(random.uniform(low, high), 1),
        "atmosphere": round(random.uniform(low, high), 1),
        "workload": round(random.uniform(low, high), 1),
    }


# ============================================================
# RESET
# ============================================================

def reset_db() -> None:
    """
    Полностью очищает все таблицы домена (CASCADE подчищает связанные
    programs/program_subjects/admission_records/university_vibes автоматически)
    и сбрасывает автоинкременты, чтобы id снова начинались с 1.
    """
    db = SessionLocal()
    try:
        db.execute(
            text("TRUNCATE TABLE universities, directions, subjects RESTART IDENTITY CASCADE")
        )
        db.commit()
        print("Database reset: all domain tables truncated.")
    finally:
        db.close()


# ============================================================
# SEED
# ============================================================

def seed():
    db = SessionLocal()

    try:
        # ----------------------------------------------------
        # SUBJECTS
        # ----------------------------------------------------

        subjects = {
            "russian": Subject(name="russian"),
            "math": Subject(name="math"),
            "informatics": Subject(name="informatics"),
            "social": Subject(name="social"),
            "physics": Subject(name="physics"),
            "english": Subject(name="english"),
            "foreign_language": Subject(name="foreign_language"),
        }

        db.add_all(subjects.values())
        db.flush()

        print(f"Subjects: {len(subjects)}")

        # ----------------------------------------------------
        # DIRECTIONS
        # ----------------------------------------------------

        directions = {
            "Computer Science": Direction(name="Computer Science"),
            "Software Engineering": Direction(name="Software Engineering"),
            "Data Science": Direction(name="Data Science"),
            "Business Informatics": Direction(name="Business Informatics"),
            "Applied Physics": Direction(name="Applied Physics"),
            "International Business": Direction(name="International Business"),
        }

        db.add_all(directions.values())
        db.flush()

        print(f"Directions: {len(directions)}")

        # ----------------------------------------------------
        # UNIVERSITIES
        # ----------------------------------------------------

        university_objects = []

        for data in UNIVERSITIES:
            university = University(
                name=data["name"],
                description=data["description"],
                city=data["city"],
                has_dormitory=generate_has_dormitory(),
                website=data["website"],
                rating=get_university_rating(data["category"]),
            )

            db.add(university)
            university_objects.append(
                (university, data["category"])
            )

        db.flush()

        print(f"Universities: {len(university_objects)}")

        # ----------------------------------------------------
        # UNIVERSITY VIBE
        # ----------------------------------------------------

        for university, category in university_objects:
            vibe_data = get_vibe(category)

            db.add(
                UniversityVibe(
                    university_id=university.id,
                    education=vibe_data["education"],
                    career=vibe_data["career"],
                    student_life=vibe_data["student_life"],
                    atmosphere=vibe_data["atmosphere"],
                    workload=vibe_data["workload"],
                )
            )

        print(f"University vibes: {len(university_objects)}")

        # ----------------------------------------------------
        # PROGRAMS
        # ----------------------------------------------------

        programs_created = 0
        program_subjects_created = 0
        admission_records_created = 0

        for university, category in university_objects:

            for program_type, templates in PROGRAM_TEMPLATES.items():

                # Для разнообразия названий выбираем один из вариантов.
                program_name = random.choice(templates)

                program = Program(
                    university_id=university.id,
                    direction_id=directions[program_type].id,
                    name=program_name,
                )

                db.add(program)
                db.flush()

                programs_created += 1

                # ------------------------------------------------
                # PROGRAM <-> SUBJECTS
                # ------------------------------------------------

                required_subjects = PROGRAM_SUBJECTS[program_type]

                for subject_name in required_subjects:
                    db.add(
                        ProgramSubject(
                            program_id=program.id,
                            subject_id=subjects[subject_name].id,
                        )
                    )

                    program_subjects_created += 1

                # ------------------------------------------------
                # ADMISSION RECORD
                # ------------------------------------------------

                passing_score = get_passing_score(
                    category,
                    program_type,
                )

                budget_places = get_budget_places(category)

                tuition_cost = get_tuition_cost(category)

                db.add(
                    AdmissionRecord(
                        program_id=program.id,
                        year=2025,
                        passing_score=passing_score,
                        budget_places=budget_places,
                        tuition_cost=tuition_cost,
                    )
                )

                admission_records_created += 1

        # ----------------------------------------------------
        # COMMIT
        # ----------------------------------------------------

        db.commit()

        print()
        print("=" * 60)
        print("SEED COMPLETED")
        print("=" * 60)
        print(f"Subjects:              {len(subjects)}")
        print(f"Directions:            {len(directions)}")
        print(f"Universities:          {len(university_objects)}")
        print(f"University vibes:      {len(university_objects)}")
        print(f"Programs:              {programs_created}")
        print(f"Program subjects:      {program_subjects_created}")
        print(f"Admission records:     {admission_records_created}")
        print("=" * 60)

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the university domain database.")
    parser.add_argument(
        "--reset", action="store_true", help="Truncate all domain tables before seeding."
    )
    args = parser.parse_args()

    if args.reset:
        reset_db()

    seed()
