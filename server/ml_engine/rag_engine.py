from typing import Dict, Any
import google.generativeai as genai
from langchain.document_loaders import CSVLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
import os

class RAGEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in environment")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-pro")
        self.vector_store = None
    
    def load_dataset(self, file_path: str):
        """Load dataset into vector store."""
        try:
            loader = CSVLoader(file_path)
            documents = loader.load()
            # Use simple embeddings instead of OpenAI
            from langchain.embeddings import HuggingFaceEmbeddings
            embeddings = HuggingFaceEmbeddings()
            self.vector_store = FAISS.from_documents(documents, embeddings)
        except Exception as e:
            print(f"Error loading dataset: {e}")
    
    async def process_message(self, message: str) -> str:
        """Process a chat message using RAG."""
        try:
            if self.vector_store:
                # Retrieve relevant context
                docs = self.vector_store.similarity_search(message, k=3)
                context = "\n".join([doc.page_content for doc in docs])
                prompt = f"Given context:\n{context}\n\nAnswer this question: {message}"
            else:
                prompt = message
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error processing message: {str(e)}"

rag_engine = RAGEngine()

async def process_chat_message(message: str) -> str:
    """Process chat message through the RAG engine."""
    return await rag_engine.process_message(message)