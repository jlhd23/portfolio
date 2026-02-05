import os
import shutil
from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import UploadFile
from groq import Groq
from sqlalchemy.ext.asyncio import AsyncSession

from app.params import RESUME_PDF_PATH
from app.repositories.documents import DocumentsRepository
from app.services.voice_agent.text_agent import TextAgent
from app.services.voice_agent.embedder import Embedder

class VoiceAgentService:
    def __init__(self, gemini_api_key: str | None, tavily_api_key: str | None, groq_api_key: str | None, db: AsyncSession):
        self.db = db
        self.gemini_api_key = gemini_api_key
        self.tavily_api_key = tavily_api_key
        self.groq_api_key = groq_api_key
        self.repo = DocumentsRepository(db)
        self.embedder = Embedder()

    async def transcribe_audio(self, file: UploadFile) -> str:
        """
        Transcribes audio using Groq Whisper.
        """
        self.groq_client = Groq(api_key = self.groq_api_key)
        with NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        try:
            with open(tmp_path, "rb") as f:
                transcription = self.groq_client.audio.transcriptions.create(
                    file=(file.filename, f.read()),
                    model="whisper-large-v3",
                    response_format="json",
                    temperature=0.0
                )
            return transcription.text
        finally:
            os.remove(tmp_path)

    async def _ensure_resume_indexed(self):
        """
        Checks if resume is indexed, if not, indexes it.
        """
        pdf_name = "cv_jose_huerta"
        exists = await self.repo.document_exists(pdf_name)
        if exists:
            return

        if not os.path.exists(RESUME_PDF_PATH):
            print(f"Warning: Resume PDF not found at {RESUME_PDF_PATH}")
            return

        chunks, texts, embeddings = self.embedder.embed_documents(RESUME_PDF_PATH)
        
        await self.repo.bulk_create_chunks(
            pdf_name=pdf_name,
            topic="resume of jose huerta",
            chunks=texts,
            embeddings=embeddings
        )

    async def chat_with_agent(self, api_keys: dict, query: str) -> dict:
        """
        Text agent: Checks resume or web search.
        """
        await self._ensure_resume_indexed()

        agent = TextAgent(
            documents_topic="resume of jose huerta",
            gemini_api_key=api_keys["gemini_api_key"],
            documents_repo=self.repo,
            tavily_api_key=api_keys["tavily_api_key"]
        )

        inputs = {"question": query}
        result = await agent.graph.ainvoke(inputs)
        return result
