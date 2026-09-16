from .m_user import User
from .m_subjects import Subject
from .m_user_subjects import UserSubject
from .m_university import University
from .m_direction import Direction
from .m_subject import Subject
from .m_program import Program
from .m_program_subject import ProgramSubject
from .m_admission import AdmissionRecord
from .vibe import UniversityVibe

from app.database import Base


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