from app.database import Base
from app.models.m_university import University
from app.models.m_direction import Direction
from app.models.m_subject import Subject
from app.models.m_program import Program
from app.models.m_program_subject import ProgramSubject
from app.models.m_admission import AdmissionRecord
from app.models.m_vibe import UniversityVibe

__all__ = [
    "Base",
    "University",
    "Direction",
    "Subject",
    "Program",
    "ProgramSubject",
    "AdmissionRecord",
    "UniversityVibe",
]
