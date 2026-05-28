from fastapi import FastAPI
from app.core.config import settings
from app.api.api import api_router
from app.db.base import Base
from app.db.session import engine
from sqlalchemy import text
import logging

logger = logging.getLogger(__name__)


def safe_migrate_schema() -> None:
    """
    Idempotent schema migration for production.

    SQLAlchemy's create_all() creates *missing* tables but never ALTERs
    existing ones.  When we add new columns to an existing model (e.g. phone,
    profile_image_url, deleted_at on the users table) those columns must be
    added manually.  This function runs ADD COLUMN IF NOT EXISTS statements so
    it is always safe to call on startup — it is a no-op when the columns
    already exist.
    """
    migrations = [
        # users table — new columns added in the settings module
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE",
    ]

    with engine.connect() as conn:
        for stmt in migrations:
            try:
                conn.execute(text(stmt))
                logger.info("Migration OK: %s", stmt)
            except Exception as exc:
                # Log but don't crash — the column may already exist in some DBs
                logger.warning("Migration skipped (%s): %s", exc, stmt)
        conn.commit()


# 1. Create any completely missing tables (user_settings, resume_builder_data, etc.)
Base.metadata.create_all(bind=engine)

# 2. Patch existing tables with new columns added since the last deploy
try:
    safe_migrate_schema()
except Exception as exc:
    logger.error("safe_migrate_schema failed: %s", exc)


from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path="/_/backend",  # Vercel routePrefix — keeps docs/redirects correct
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://smart-job-frontend.onrender.com",
        "https://smart-job-matching.onrender.com",
        "https://careernoix-u1is.vercel.app",
    ],
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1):\d+$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "Welcome to Smart Job Matching API"}

from sqlalchemy.orm import Session
from fastapi import Depends
from app.api import deps
from scripts.seed_db import seed_data

@app.get("/seed")
def seed_db(db: Session = Depends(deps.get_db)):
    """
    WARNING: Use this only for initial setup!
    """
    try:
        seed_data(db)
        return {"message": "Database seeded successfully"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/reset-db")
def reset_db():
    """
    WARNING: This will drop ALL data and recreate tables.
    Use this to fix schema mismatches on Render.
    """
    try:
        from app.db.session import engine
        from app.db.base import Base
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        return {"message": "Database reset successfully. Schema is now up to date."}
    except Exception as e:
        return {"error": str(e)}
