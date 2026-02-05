from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.databases.postgresql.db import get_db
from app.services.voice_agent.voice_agent_service import VoiceAgentService
from app.schemas.voice_agent import ChatRequest, ChatResponse, TranscribeResponse, DocumentSchema

router = APIRouter(prefix="/voice-agent", tags=["Voice Agent"])

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    file: UploadFile = File(...),
    groq_api_key: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = VoiceAgentService(None, None, groq_api_key, db)
        text = await service.transcribe_audio(file)
        if not text:
            raise HTTPException(status_code=500, detail="Transcription failed: Empty result")
        return TranscribeResponse(transcription=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcribe Error: {str(e)}")

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        service = VoiceAgentService(request.gemini_api_key, request.tavily_api_key, None, db)
        
        api_keys = {
            "gemini_api_key": request.gemini_api_key,
            "tavily_api_key": request.tavily_api_key
        }
        
        result = await service.chat_with_agent(api_keys=api_keys, query=request.query)
        
        docs = [
            DocumentSchema(page_content=doc.page_content, metadata=doc.metadata)
            for doc in result["retrieved_docs"]
        ]
        
        return ChatResponse(
            answer = result["answer"],
            retrieved_docs = docs,
            question = result["question"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat Error: {str(e)}")
