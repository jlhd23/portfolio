from typing import List, TypedDict
from unittest import result
from app.schemas.voice_agent import RouteQuery, GradeDocuments
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langgraph.graph import StateGraph, START, END

from langchain_google_genai import (
    ChatGoogleGenerativeAI
)

from langchain_community.tools.tavily_search import TavilySearchResults

from app.repositories.documents import DocumentsRepository


class AgentState(TypedDict):
    question: str
    retrieved_docs: List[Document]
    answer: str
    

class TextAgent:
    def __init__(
        self,
        documents_topic: str,
        gemini_api_key: str,
        documents_repo: DocumentsRepository,
        tavily_api_key: str | None = None,
    ):
        self.documents_topic = documents_topic
        self.repo = documents_repo

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash-lite",
            temperature=0,
            google_api_key=gemini_api_key,
        )

        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        search_wrapper = TavilySearchAPIWrapper(tavily_api_key=tavily_api_key)

        self.web_search_tool = TavilySearchResults(
            api_wrapper=search_wrapper,
            k=3
        )

        self.router_llm = self.llm.with_structured_output(RouteQuery)
        self.doc_grader = self.llm.with_structured_output(GradeDocuments)

        self.graph = self._build_graph()
        
    def _route_question(self, state: AgentState) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Decide whether the question should be answered using "
                    "internal documents or requires a web search. The topic of the "
                    "document is '{topic}'. "
                    "Answer with 'vectorstore' or 'web_search'.",
                ),
                ("human", "{question}"),
            ]
        )

        result = self.router_llm.invoke(
            prompt.format_messages(
                question=state["question"], 
                topic=self.documents_topic
            )
        )

        return result.datasource
    
    async def _retrieve(self, state: AgentState) -> dict:
        query_embedding = self.embeddings.embed_query(state["question"])
        chunks = await self.repo.semantic_search(
            query_embedding=query_embedding,
            limit=5, 
            topic=self.documents_topic
        )

        docs = [
            Document(
                page_content=c.chunk_text,
                metadata={"pdf_name": c.pdf_name, "topic": c.topic},
            )
            for c in chunks
        ]
        return {"retrieved_docs": docs, "question": state["question"]}
    
    def _web_search(self, state: AgentState) -> dict:
        results = self.web_search_tool.invoke(
            {"query": state["question"]}
        )

        content = "\n\n".join(r["content"] for r in results)

        docs = [
            Document(
                page_content=content,
                metadata={"source": "web"},
            )
        ]

        return {
            "retrieved_docs": docs,
            "question": state["question"],
        }
    
    def _grade_documents(self, state: AgentState) -> dict:
        filtered_docs = []

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Determine whether the document is relevant to the question. "
                    "Answer 'yes' or 'no'.",
                ),
                (
                    "human",
                    "Question:\n{question}\n\nDocument:\n{document}",
                ),
            ]
        )

        for doc in state["retrieved_docs"]:
            result = self.doc_grader.invoke(
                prompt.format_messages(
                    question=state["question"],
                    document=doc.page_content,
                )
            )

            if result.binary_score.lower() == "yes":
                filtered_docs.append(doc)

        return {
            "retrieved_docs": filtered_docs,
            "question": state["question"],
        }
    async def _generate(self, state: AgentState) -> dict:
        context = "\n\n".join(
            doc.page_content for doc in state["retrieved_docs"]
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant. "
                    "Answer ONLY using the provided context. "
                    "ALWAYS respond in English, regardless of the user's language.",
                ),
                (
                    "human",
                    "Context:\n{context}\n\nQuestion:\n{question}",
                ),
            ]
        )

        chain = prompt | self.llm | StrOutputParser()

        answer = chain.invoke(
            {
                "context": context,
                "question": state["question"],
            }
        )

        return {
            "answer": answer,
            "retrieved_docs": state["retrieved_docs"],
            "question": state["question"],
        }
    

    def _check_documents(self, state: AgentState) -> str:
        """
        Checks if there are any documents left after filtering.
        """
        return "yes" if state["retrieved_docs"] else "no"

    def _build_graph(self):
        graph = StateGraph(AgentState)

        graph.add_node("retrieve", self._retrieve)
        graph.add_node("web_search", self._web_search)
        graph.add_node("grade_documents", self._grade_documents)
        graph.add_node("generate", self._generate)

        graph.add_conditional_edges(
            START,
            self._route_question,
            {
                "vectorstore": "retrieve",
                "web_search": "web_search",
            },
        )

        graph.add_edge("retrieve", "grade_documents")
        
        graph.add_conditional_edges(
            "grade_documents",
            self._check_documents,
            {
                "yes": "generate",
                "no": "web_search",
            },
        )

        graph.add_edge("web_search", "generate")
        graph.add_edge("generate", END)

        return graph.compile()