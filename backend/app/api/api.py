from fastapi import APIRouter
from app.api.endpoints import auth, job_roles, courses, resume, matches, resume_builder

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(job_roles.router, prefix="/job-roles", tags=["job-roles"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(resume_builder.router, prefix="/resume-builder", tags=["resume-builder"])
