from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
from uuid import UUID

class DocumentChunkSchema(BaseModel):
    id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    pdf_name: str
    topic: str
    chunk_index: int
    chunk_text: str
    # embedding is likely returned as a string or list by SQLAlchemy/pgvector
    # We'll default to typing it generally or List[float] if the driver converts it.
    # For now, let's omit it or allow Any to avoid validation errors if it comes as a special object.
    # embedding: Any 

    class Config:
        from_attributes = True
