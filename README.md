# José Huerta – Personal Portfolio

A personal portfolio compiling different small projects and experiments I have worked on over time, showcasing skills in full-stack development and AI integration.

## 🚀 Projects

Based on the current portfolio implementation, the following projects are featured:

1. **Web Development (This Portfolio)**  
   A modern, responsive web application built with Next.js 15, featuring a dynamic UI with animations and a dark mode aesthetic.

2. **RAG System (Retrieval Augmented Generation)**  
   An AI-powered system capable of answering questions based on uploaded PDF documents and falling back to web search when necessary. Built using **LangGraph** and **Gemini**.

3. **Voice Agent**  
   A voice-activated AI agent that integrates **Whisper (via Groq)** for transcription and **Gemini** for intelligence, orchestrated with **LangGraph** to provide natural language interactions.

---

## 🛠 Technologies

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: TailwindCSS, HeroUI (formerly NextUI)
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React, React Icons
- **State/Theme**: Next Themes

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Package Manager**: Poetry
- **Database**: PostgreSQL (with pgvector for embeddings)
- **ORM**: SQLAlchemy (Async) with Alembic for migrations

### AI & Agents
- **Orchestration**: LangChain, LangGraph
- **LLMs**: Google Gemini
- **Embeddings**: HuggingFace (Sentence Transformers)
- **Transcription**: Groq (Whisper)
- **Web Search**: Tavily

---

## 💻 How to Use

The entire application is containerized and can be run using Docker Compose.

### 1. Environment Setup

Create a `.env` file in the root directory. You can use the following template based on the required configuration:

```env
# Frontend Configuration
NEXT_PUBLIC_FRONTEND_URL="http://localhost"
NEXT_PUBLIC_PORT="4000"
NEXT_PUBLIC_BACKEND_HOST_MAIN_API="http://localhost"
NEXT_PUBLIC_BACKEND_PORT_MAIN_API="3000"
PORT="4000"

# Backend Configuration
BACKEND_GC_TITLE="Local FastAPI Base"
BACKEND_GC_DESCRIPTION="Local API Base example"
BACKEND_GC_API_PREFIX=""
BACKEND_GC_HOST="0.0.0.0"
BACKEND_GC_PORT="3000"
BACKEND_GC_OPENAPI_PREFIX=""
BACKEND_APP_ENVIRONMENT="development"
BACKEND_FRONTEND_URL="http://localhost"

# Security
BACKEND_SECURITY_SECRET_KEY="your_secret_key_here"
BACKEND_SECURITY_ALGORITHM="HS256"

# Database Configuration (PostgreSQL)
BACKEND_DB_PSQL_HOST="database"
BACKEND_DB_PSQL_NAME="your_postgresql_db_name"
BACKEND_DB_PSQL_USER="your_postgresql_db_user"
BACKEND_DB_PSQL_PASSWORD="your_postgresql_db_password"
BACKEND_DB_PSQL_PORT="your_postgresql_db_port"
```

> **Note**: You will also need API keys for Google Gemini, Groq, and Tavily if you intend to use the AI features. Check the backend code or add them to the `.env` if required by the application logic.

> **Important**: If you do not provide valid database credentials in the `.env` file, you will still be able to navigate the website and view the UI, but the **AI features** (like RAG and Voice Agent) will **NOT** work, as they require database access for storage and retrieval.

### 2. Run with Docker

To start the application (frontend, backend, and database), run:

```bash
docker compose up --build
```

The services will be available at:
- **Frontend**: http://localhost:4000
- **Backend API Docs**: http://localhost:3000/docs