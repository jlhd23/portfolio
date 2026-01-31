from fastapi import APIRouter  
from app.api.routes.rag_system import router as rag_router

router = APIRouter()  

router.include_router(rag_router)