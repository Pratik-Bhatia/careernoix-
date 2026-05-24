from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="user", uselist=False)
    matches = relationship("MatchResult", back_populates="user")
    resume_builder_data = relationship("ResumeBuilderData", back_populates="user", uselist=False)

class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=False) # List of skills

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    provider = Column(String, index=True)
    url = Column(String)
    difficulty = Column(String, default="Beginner") # Beginner, Intermediate, Advanced
    skills_covered = Column(JSON, nullable=False) # List of skills taught

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text) # Raw text or link
    parsed_skills = Column(JSON) # Extracted skills
    
    user = relationship("User", back_populates="resume")

class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_role_id = Column(Integer, ForeignKey("job_roles.id"))
    score = Column(Integer) # Percentage or score
    details = Column(JSON) # Breakdown of match
    
    user = relationship("User", back_populates="matches")
    job_role = relationship("JobRole")

class ResumeBuilderData(Base):
    """Stores the structured resume builder form data per user account."""
    __tablename__ = "resume_builder_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    data = Column(JSON, nullable=False, default=dict)  # Full ResumeData JSON blob
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="resume_builder_data")
