from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from app.databases.postgresql.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    description = Column(String)
    program = Column(JSONB)
    institution = Column(JSONB)
    photograph = Column(String)
    github_profile_url = Column(String)
    web_page_url = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)