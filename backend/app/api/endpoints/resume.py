from typing import Any, List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.all_models import Resume, User, JobRole, MatchResult, ResumeBuilderData
from app.services.resume_parser import extract_text_from_pdf, parse_resume
from app.services.matching import calculate_match
from app.core import security
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from jose import jwt, JWTError

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR if hasattr(settings, 'API_V1_STR') else ''}/auth/login")

def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return int(user_id)

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user_id: int = Depends(get_current_user_id),
) -> Any:
    # 1. State: Uploaded
    stages = ["uploaded"]
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # 2. Extract Text
    content = await file.read()
    raw_text = extract_text_from_pdf(content)
    stages.append("extracted_text")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    # 3. Parse JSON
    parsed_data = parse_resume(raw_text)
    stages.append("parsed_json")

    # 4. Save Resume to DB
    resume_skills = parsed_data.get("skills", [])
    existing_resume = db.query(Resume).filter(Resume.user_id == current_user_id).first()
    if existing_resume:
        existing_resume.content = raw_text
        existing_resume.parsed_skills = resume_skills
        db.add(existing_resume)
    else:
        new_resume = Resume(
            user_id=current_user_id,
            content=raw_text,
            parsed_skills=resume_skills
        )
        db.add(new_resume)

    # Save parsed data to ResumeBuilderData so it updates the frontend builder
    builder_record = db.query(ResumeBuilderData).filter(ResumeBuilderData.user_id == current_user_id).first()
    if builder_record:
        builder_record.data = parsed_data
        db.add(builder_record)
    else:
        builder_record = ResumeBuilderData(
            user_id=current_user_id,
            data=parsed_data
        )
        db.add(builder_record)
    
    db.commit()
    stages.append("parsed_json_saved")

    # 5. Auto-generate matches against ALL job roles
    job_roles = db.query(JobRole).all()
    match_summaries = []

    for job_role in job_roles:
        job_skills = job_role.required_skills if job_role.required_skills else []
        result = calculate_match(resume_skills, job_skills)

        # Upsert match result
        match_entry = db.query(MatchResult).filter(
            MatchResult.user_id == current_user_id,
            MatchResult.job_role_id == job_role.id
        ).first()

        if match_entry:
            match_entry.score = result["score"]
            match_entry.details = result
        else:
            match_entry = MatchResult(
                user_id=current_user_id,
                job_role_id=job_role.id,
                score=result["score"],
                details=result
            )
            db.add(match_entry)

        match_summaries.append({
            "job_role_id": job_role.id,
            "job_title": job_role.title,
            "score": result["score"],
            "matched_skills": result["matched_skills"],
            "missing_skills": result["missing_skills"],
        })

    db.commit()
    stages.append("matches_generated")

    return {
        "filename": file.filename,
        "parsed_data": parsed_data,
        "matches": match_summaries,
        "total_matches": len(match_summaries),
        "progress": stages
    }
