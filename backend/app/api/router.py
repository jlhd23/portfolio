from fastapi import APIRouter  
from app.api.routes.rag_system import router as rag_router
from app.api.routes.voice_agent import router as voice_agent_router

from app.api.routes.documents import router as documents_router

router = APIRouter()  

router.include_router(rag_router)
router.include_router(voice_agent_router)
router.include_router(documents_router)