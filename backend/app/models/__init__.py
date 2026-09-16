from .m_user import User
from .m_subjects import Subject
from .m_user_subjects import UserSubject
from .university import University
from .direction import Direction
from .subject import Subject
from .program import Program
from .program_subject import ProgramSubject
from .admission import AdmissionRecord
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