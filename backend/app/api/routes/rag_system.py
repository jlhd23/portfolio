from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from langchain_community.embeddings import HuggingFaceEmbeddings
import tempfile
import os

from app.databases.postgresql.db import get_db
from app.repositories.documents import DocumentsRepository
from app.services.rag.rag_system import RAGAgent
from app.services.rag.pdf_loader import load_and_split_pdf

router = APIRouter(prefix="/rag", tags=["RAG"])

@router.post("/query")
async def rag_query(
    pdf: UploadFile = File(...),
    question: str = Form(...),
    documents_topic: str = Form(...),
    gemini_api_key: str = Form(...),
    tavily_api_key: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    """
    RAG endpoint:
    - Reutiliza chunks si el PDF ya existe
    - Si no existe, lo indexa
    - Ejecuta LangGraph con fallback a web search
    """

    pdf_name = pdf.filename
    repo = DocumentsRepository(db)
    pdf_exists = await repo.document_exists(pdf_name)

    if not pdf_exists:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(await pdf.read())
                tmp_path = tmp.name

            docs = load_and_split_pdf(tmp_path)
            embeddings_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
            texts = [doc.page_content for doc in docs]
            vectors = embeddings_model.embed_documents(texts)
            await repo.bulk_create_chunks(
                pdf_name=pdf_name,
                topic=documents_topic,
                chunks=texts,
                embeddings=vectors
            )

        finally:
            os.remove(tmp_path)

    rag = RAGAgent(
        documents_topic=documents_topic,
        gemini_api_key=gemini_api_key,
        tavily_api_key=tavily_api_key,
        documents_repo=repo,
    )
    rag.save_graph("mi_flujo_cyberpunk.png")
    result = await rag.graph.ainvoke({"question": question})
    docs = result.get("retrieved_docs", [])
    
    if not docs:
        source_display = "No relevant sources found"
    else:
        first_doc = docs[0]
        if first_doc.metadata.get("source") == "web":
            source_display = "Internet (Real-time search via Tavily)"
        else:
            pdf_name = first_doc.metadata.get("pdf_name", "Uploaded document")
            source_display = f"PDF File: {pdf_name}"

    return {
        "answer": result.get("answer"),
        "source": source_display,
        "topic": documents_topic
    }