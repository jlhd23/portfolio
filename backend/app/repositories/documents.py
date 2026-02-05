from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.document_chunks import DocumentChunk


class DocumentsRepository:
    def __init__(self, db: Session):
        self.db = db

    async def document_exists(self, pdf_name: str) -> bool:
        """
        Check if a PDF has already been indexed.
        """
        stmt = (
            select(DocumentChunk.id)
            .where(DocumentChunk.pdf_name == pdf_name)
            .limit(1)
        )
        result = await self.db.execute(stmt) 
        return result.first() is not None

    async def bulk_create_chunks(
        self,
        pdf_name: str,
        topic: Optional[str],
        chunks: List[str],
        embeddings: List[List[float]],
    ) -> None:
        """
        Persist document chunks and embeddings.
        """
        objects = [
            DocumentChunk(
                pdf_name=pdf_name,
                topic=topic,
                chunk_index=idx,
                chunk_text=content,
                embedding=embedding,
            )
            for idx, (content, embedding) in enumerate(zip(chunks, embeddings))
        ]

        self.db.add_all(objects)
        await self.db.commit()

    async def get_chunks_by_pdf_name(
        self,
        pdf_name: str,
    ) -> List[DocumentChunk]:
        """
        Retrieve all chunks of a given PDF (ordered).
        """
        stmt = (
            select(DocumentChunk)
            .where(DocumentChunk.pdf_name == pdf_name)
            .order_by(DocumentChunk.chunk_index)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_chunks_by_topic(
        self,
        topic: str,
    ) -> List[DocumentChunk]:
        """
        Retrieve all chunks matching a topic.
        """
        stmt = select(DocumentChunk).where(DocumentChunk.topic == topic)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def semantic_search(
        self,
        query_embedding: List[float],
        limit: int = 5,
        pdf_name: Optional[str] = None,
        topic: Optional[str] = None,
    ) -> List[DocumentChunk]:
        """
        Vector similarity search using pgvector.
        Can be scoped by pdf_name and/or topic.
        """
        stmt = (
            select(DocumentChunk)
            .order_by(DocumentChunk.embedding.l2_distance(query_embedding))
            .limit(limit)
        )

        if pdf_name:
            stmt = stmt.where(DocumentChunk.pdf_name == pdf_name)

        if topic:
            stmt = stmt.where(DocumentChunk.topic == topic)

        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_all_chunks(self) -> List[DocumentChunk]:
        """
        Retrieve all document chunks from the database.
        """
        stmt = select(DocumentChunk)
        result = await self.db.execute(stmt)
        return result.scalars().all()
