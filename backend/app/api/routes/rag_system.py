from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from langchain_google_genai import GoogleGenerativeAIEmbeddings
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
    db: Session = Depends(get_db),
):
    """
    RAG endpoint:
    - Reutiliza chunks si el PDF ya existe
    - Si no existe, lo indexa
    - Ejecuta LangGraph con fallback a web search
    """

    pdf_name = pdf.filename
    repo = DocumentsRepository(db)
    pdf_exists = repo.document_exists(pdf_name)

    if not pdf_exists:
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(await pdf.read())
                tmp_path = tmp.name

            docs = load_and_split_pdf(tmp_path)

            embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=gemini_api_key,
            )

            for doc in docs:
                embedding = embeddings.embed_query(doc.page_content)

                repo.create_chunk(
                    pdf_name=pdf_name,
                    topic=documents_topic,
                    content=doc.page_content,
                    embedding=embedding,
                )

        finally:
            os.remove(tmp_path)

    rag = RAGAgent(
        documents_topic=documents_topic,
        gemini_api_key=gemini_api_key,
        tavily_api_key=tavily_api_key,
        documents_repo=repo,
    )

    result = rag.graph.invoke({"question": question,})
    print(result)
    return {
        "answer": result.get("answer"),
        "used_docs": [
            {
                "pdf_name": d.metadata.get("pdf_name"),
                "source": d.metadata.get("source", "vectorstore"),
            }
            for d in result.get("retrieved_docs", [])
        ],
    }
