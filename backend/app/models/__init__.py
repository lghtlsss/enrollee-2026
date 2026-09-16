from app.database import Base
from app.models.university import University
from app.models.direction import Direction
from app.models.subject import Subject
from app.models.program import Program
from app.models.program_subject import ProgramSubject
from app.models.admission import AdmissionRecord
from app.models.vibe import UniversityVibe

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