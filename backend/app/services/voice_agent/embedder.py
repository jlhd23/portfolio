from langchain_community.embeddings import HuggingFaceEmbeddings
from app.services.rag.pdf_loader import load_and_split_pdf

class Embedder:
    def __init__(self):
        self.model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    def embed_documents(self, pdf_path):
        chunks = load_and_split_pdf(pdf_path)
        texts = [c.page_content for c in chunks]
        embeddings = self.model.embed_documents(texts)
        return chunks, texts, embeddings