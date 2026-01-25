from typing import List, TypedDict
from app.schemas.rag import RouteQuery, GradeDocuments, GradeAnswer

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document

from langgraph.graph import StateGraph, START, END

from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    GoogleGenerativeAIEmbeddings,
)

from langchain_community.tools.tavily_search import TavilySearchResults

from app.repositories.documents import DocumentsRepository


class RAGState(TypedDict):
    question: str
    retrieved_docs: List[Document]
    answer: str
    

class RAGAgent:
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
            model="gemini-2.5-pro",
            temperature=0,
            google_api_key=gemini_api_key,
        )

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=gemini_api_key,
        )


        self.web_search_tool = TavilySearchResults(
            k=3,
            api_key=tavily_api_key,
        )

        self.router_llm = self.llm.with_structured_output(RouteQuery)
        self.doc_grader = self.llm.with_structured_output(GradeDocuments)
        self.answer_grader = self.llm.with_structured_output(GradeAnswer)

        self.graph = self._build_graph()
        
    def _route_question(self, state: RAGState) -> str:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Decide whether the question should be answered using "
                    "internal documents or requires a web search. The topic of the"
					"document is '{self.documents_topic}'. "
                    "Answer with 'vectorstore' or 'web_search'.",
                ),
                ("human", "{question}"),
            ]
        )

        result = self.router_llm.invoke(
            prompt.format_messages(question=state["question"])
        )

        return result.datasource
    
    def _retrieve(self, state: RAGState) -> dict:
        query_embedding = self.embeddings.embed_query(state["question"])

        chunks = self.repo.similarity_search(
            query_embedding=query_embedding,
            k=5,
        )

        docs = [
            Document(
                page_content=c.content,
                metadata={
                    "pdf_name": c.pdf_name,
                    "topic": c.topic,
                },
            )
            for c in chunks
        ]

        return {
            "retrieved_docs": docs,
            "question": state["question"],
        }
    
    def _web_search(self, state: RAGState) -> dict:
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
    
    def _grade_documents(self, state: RAGState) -> dict:
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
    def _generate(self, state: RAGState) -> dict:
        context = "\n\n".join(
            doc.page_content for doc in state["retrieved_docs"]
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "You are a helpful assistant. "
                    "Answer ONLY using the provided context.",
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
    def _grade_answer(self, state: RAGState) -> dict:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Determine whether the answer addresses the question. "
                    "Answer 'yes' or 'no'.",
                ),
                (
                    "human",
                    "Question:\n{question}\n\nAnswer:\n{answer}",
                ),
            ]
        )

        result = self.answer_grader.invoke(
            prompt.format_messages(
                question=state["question"],
                answer=state["answer"],
            )
        )

        return {
            "answer_valid": result.binary_score.lower() == "yes"
        }
    def _rewrite_question(self, state: RAGState) -> dict:
        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Rewrite the question to improve document retrieval.",
                ),
                ("human", "{question}"),
            ]
        )

        new_question = (
            prompt | self.llm | StrOutputParser()
        ).invoke({"question": state["question"]})

        return {"question": new_question}
    
    def _should_retry(self, state: dict) -> str:
        return "rewrite_question" if not state["answer_valid"] else END
    
    def _build_graph(self):
        graph = StateGraph(RAGState)

        graph.add_node("retrieve", self._retrieve)
        graph.add_node("web_search", self._web_search)
        graph.add_node("grade_documents", self._grade_documents)
        graph.add_node("generate", self._generate)
        graph.add_node("grade_answer", self._grade_answer)
        graph.add_node("rewrite_question", self._rewrite_question)

        # START → ROUTER
        graph.add_conditional_edges(
            START,
            self._route_question,
            {
                "vectorstore": "retrieve",
                "web_search": "web_search",
            },
        )

        graph.add_edge("retrieve", "grade_documents")
        graph.add_edge("grade_documents", "generate")

        graph.add_edge("web_search", "generate")

        graph.add_edge("generate", "grade_answer")

        graph.add_conditional_edges(
            "grade_answer",
            self._should_retry,
            {
                "rewrite_question": "rewrite_question",
                END: END,
            },
        )

        graph.add_edge("rewrite_question", "retrieve")

        return graph.compile()