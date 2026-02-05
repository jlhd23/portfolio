from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.databases.postgresql.db import get_db
from app.repositories.documents import DocumentsRepository
from app.schemas.documents import DocumentChunkSchema

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("/", response_model=List[DocumentChunkSchema])
async def get_all_documents(db: AsyncSession = Depends(get_db)):
    """
    Get all document chunks stored in the database.
    """
    repo = DocumentsRepository(db)
    return await repo.get_all_chunks()
