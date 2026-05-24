from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.api.endpoints.resume import get_current_user_id
from app.models.all_models import ResumeBuilderData

router = APIRouter()


class ResumeBuilderPayload(BaseModel):
    """Accepts an arbitrary JSON object — mirrors the frontend ResumeData shape."""
    data: dict


@router.get("/", response_model=dict)
def get_resume_builder_data(
    db: Session = Depends(deps.get_db),
    current_user_id: int = Depends(get_current_user_id),
) -> Any:
    """Return the logged-in user's resume builder data, or an empty dict if none saved yet."""
    record = (
        db.query(ResumeBuilderData)
        .filter(ResumeBuilderData.user_id == current_user_id)
        .first()
    )
    if not record:
        return {}
    return record.data or {}


@router.put("/", response_model=dict)
def save_resume_builder_data(
    payload: ResumeBuilderPayload,
    db: Session = Depends(deps.get_db),
    current_user_id: int = Depends(get_current_user_id),
) -> Any:
    """Upsert the full resume builder data for the logged-in user."""
    record = (
        db.query(ResumeBuilderData)
        .filter(ResumeBuilderData.user_id == current_user_id)
        .first()
    )
    if record:
        record.data = payload.data
        db.add(record)
    else:
        record = ResumeBuilderData(user_id=current_user_id, data=payload.data)
        db.add(record)

    db.commit()
    db.refresh(record)
    return record.data
