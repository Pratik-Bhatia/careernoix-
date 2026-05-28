from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    settings = relationship("UserSettings", back_populates="user", uselist=False)

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

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True)
    
    profile_headline = Column(String, nullable=True)
    preferred_job_role = Column(String, nullable=True)
    preferred_industry = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    preferred_work_type = Column(String, nullable=True)
    
    default_resume_template = Column(String, nullable=True)
    auto_save_enabled = Column(Boolean, default=True)
    ai_suggestions_enabled = Column(Boolean, default=True)
    ats_optimization_enabled = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")
