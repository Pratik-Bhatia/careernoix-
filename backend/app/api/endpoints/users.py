from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.api import deps
from app.models.all_models import User, UserSettings
from app.schemas.user import (
    UserResponse,
    UserSettingsResponse,
    UserSettingsUpdate,
    UserProfileUpdate,
    ChangePasswordRequest
)
from app.core import security
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR if hasattr(settings, 'API_V1_STR') else ''}/auth/login")

def get_current_user(
    db: Session = Depends(deps.get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
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
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

@router.get("/me", response_model=UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    return current_user

@router.delete("/me")
def delete_user_me(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    current_user.is_active = False
    current_user.deleted_at = func.now()
    db.commit()
    return {"message": "Account deactivated successfully"}

@router.get("/me/settings", response_model=UserSettingsResponse)
def get_user_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    user_settings = current_user.settings
    if not user_settings:
        user_settings = UserSettings(user_id=current_user.id)
        db.add(user_settings)
        db.commit()
        db.refresh(user_settings)
    return user_settings

@router.put("/me/settings", response_model=UserSettingsResponse)
def update_user_settings(
    settings_in: UserSettingsUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    user_settings = current_user.settings
    if not user_settings:
        user_settings = UserSettings(user_id=current_user.id)
        db.add(user_settings)
    
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user_settings, field, value)
    
    db.commit()
    db.refresh(user_settings)
    return user_settings

@router.put("/me/profile")
def update_user_profile(
    profile_in: UserProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.phone is not None:
        current_user.phone = profile_in.phone
        
    if profile_in.profile_headline is not None:
        user_settings = current_user.settings
        if not user_settings:
            user_settings = UserSettings(user_id=current_user.id)
            db.add(user_settings)
        user_settings.profile_headline = profile_in.profile_headline

    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/me/password")
def change_password(
    password_req: ChangePasswordRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if not security.verify_password(password_req.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = security.get_password_hash(password_req.new_password)
    db.commit()
    return {"message": "Password changed successfully"}
