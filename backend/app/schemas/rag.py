from pydantic import BaseModel, Field
from typing import Literal, Optional, List

class GradeDocuments(BaseModel):
    binary_score: str = Field(description="yes or no")

class GradeAnswer(BaseModel):
    binary_score: str = Field(description="yes or no")

class RouteQuery(BaseModel):
    datasource: Literal["vectorstore", "web_search"] = Field(
        description="Route question to vectorstore or web search"
    )

# class RAGQueryRequest(BaseModel):
#     question: str
#     document_name: Optional[str] = None


# class RAGQueryResponse(BaseModel):
#     answer: str
#     used_web_search: bool
#     retrieved_chunks: List[str]