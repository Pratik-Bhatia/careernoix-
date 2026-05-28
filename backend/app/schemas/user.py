from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# User
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class UserSettingsBase(BaseModel):
    profile_headline: Optional[str] = None
    preferred_job_role: Optional[str] = None
    preferred_industry: Optional[str] = None
    experience_level: Optional[str] = None
    preferred_work_type: Optional[str] = None
    default_resume_template: Optional[str] = None
    auto_save_enabled: bool = True
    ai_suggestions_enabled: bool = True
    ats_optimization_enabled: bool = True

class UserSettingsUpdate(UserSettingsBase):
    pass

class UserSettingsResponse(UserSettingsBase):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_headline: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
