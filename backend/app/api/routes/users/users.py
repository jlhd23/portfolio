from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from app.databases.postgresql.db import get_db
from app.databases.postgresql.models.user import User

router = APIRouter()

@router.get("", response_model=dict)
async def get_users(db_postgresql_session: AsyncSession = Depends(get_db)):
    """
    Retrieves all users from the database orden by program.
    """
    return "hello"