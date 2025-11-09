from typing import Dict, Any
from langchain import OpenAI, LLMChain, PromptTemplate
from langchain.document_loaders import CSVLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
import os

class RAGEngine:
    def __init__(self):
        self.llm = OpenAI(temperature=0.7)
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = None
        self.template = """
        Given the following context and question, provide a helpful response:
        
        Context: {context}
        
        Question: {question}
        
        Response:"""
        
        self.prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=self.template
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)
    
    def load_dataset(self, file_path: str):
        """Load dataset into vector store."""
        loader = CSVLoader(file_path)
        documents = loader.load()
        self.vector_store = FAISS.from_documents(documents, self.embeddings)
    
    async def process_message(self, message: str) -> str:
        """Process a chat message using RAG."""
        if not self.vector_store:
            return "Please load a dataset first."
        
        # Retrieve relevant context
        docs = self.vector_store.similarity_search(message, k=3)
        context = "\n".join([doc.page_content for doc in docs])
        
        # Generate response
        response = await self.chain.arun(context=context, question=message)
        return response

rag_engine = RAGEngine()

async def process_chat_message(message: str) -> str:
    """Process chat message through the RAG engine."""
    return await rag_engine.process_message(message)