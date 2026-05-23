import os
from pydantic_settings import BaseSettings
from typing import Optional


def _get_database_url() -> str:
    """Resolve DATABASE_URL from environment, fixing SQLAlchemy driver prefix."""
    raw = (
        os.getenv("DATABASE_URL")
        or os.getenv("POSTGRES_URL")
        or "postgresql://username:password@127.0.0.1:5432/your_local_db"
    )
    # Neon (and some other providers) return 'postgres://' which SQLAlchemy
    # does not recognise — replace with 'postgresql://'.
    if raw.startswith("postgres://"):
        raw = "postgresql://" + raw[len("postgres://"):]
    return raw

class Settings(BaseSettings):
    PROJECT_NAME: str = "Smart Job Matching"
    
    # Database
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "Alok12")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "127.0.0.1")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "smart_job_matching")
    DATABASE_URL: str = _get_database_url()

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
