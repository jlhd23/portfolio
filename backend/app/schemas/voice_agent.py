from typing import List, Literal, Dict, Any
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    query: str
    gemini_api_key: str
    tavily_api_key: str

class DocumentSchema(BaseModel):
    page_content: str
    metadata: Dict[str, Any]

class ChatResponse(BaseModel):
    answer: str
    retrieved_docs: List[DocumentSchema]
    question: str

class TranscribeResponse(BaseModel):
    transcription: str

class GradeDocuments(BaseModel):
    binary_score: str = Field(description="yes or no")

class RouteQuery(BaseModel):
    datasource: Literal["vectorstore", "web_search"] = Field(
        description="Route question to vectorstore or web search"
    )