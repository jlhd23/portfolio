from sqlalchemy import Column, String, Text
from pgvector.sqlalchemy import Vector

from app.models.base import BaseModel


class DocumentChunk(BaseModel):
    __tablename__ = "document_chunks"

    pdf_name = Column(String, nullable=False, index=True)
    topic = Column(String, nullable=False, index=True)
    chunk_text = Column(Text, nullable=False)
    embedding = Column(Vector(768), nullable=False)

