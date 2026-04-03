import os
import google.generativeai as genai
from pinecone import Pinecone
from django.conf import settings

class VectorService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "snapit")
        self.index = self.pc.Index(self.index_name)

    def get_embeddings(self, text_list):
        """Batch process embeddings from Gemini."""
        if not text_list:
            return []
        
        try:
            result = genai.embed_content(
                model="models/text-embedding-004",
                content=text_list,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Gemini Embedding Error: {e}")
            raise e

    def index_repository(self, chunks, repo_id):
        """Index chunks into Pinecone using namespaces."""
        if not chunks:
            return 0

        namespace = f"repo_{repo_id}"
        batch_size = 50 
        contents = [chunk['content'] for chunk in chunks]
        
        embeddings = self.get_embeddings(contents)
        
        vectors = []
        for i, chunk in enumerate(chunks):
            vectors.append({
                "id": f"{repo_id}_{i}",
                "values": embeddings[i],
                "metadata": {
                    "file_path": chunk['file_path'],
                    "chunk_index": chunk['chunk_index'],
                    "repo_id": chunk['metadata']['repo_id'],
                    "language": chunk['metadata']['language'],
                    "text": chunk['content'] # Store raw text for retrieval reference
                }
            })


        for i in range(0, len(vectors), batch_size):
            batch = vectors[i:i + batch_size]
            self.index.upsert(vectors=batch, namespace=namespace)
            
        return len(vectors)
