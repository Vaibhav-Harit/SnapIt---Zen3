import os
import concurrent.futures
from typing import List, Dict, Any, Optional
from pinecone import Pinecone

# Default model for Integrated Inference
MODEL_NAME = "nvidia/llama-text-embed-v2"

class VectorService:
    """
    Service class for Pinecone operations including vector search and upsert.
    Uses Pinecone's server-side Integrated Inference for embedding and search.
    """
    _instance = None
    _index = None
    _pc = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorService, cls).__new__(cls)
            cls._initialize_client()
        return cls._instance

    @classmethod
    def _initialize_client(cls):
        """Initializes the Pinecone client and index connection."""
        api_key = os.getenv("PINECONE_API_KEY")
        index_name = os.getenv("PINECONE_INDEX_NAME")
        if api_key and index_name:
            cls._pc = Pinecone(api_key=api_key)
            cls._index = cls._pc.Index(index_name)

    @property
    def index(self):
        """Lazy loader for the Pinecone index."""
        if self._index is None:
            self._initialize_client()
            if self._index is None:
                raise ValueError("PINECONE_API_KEY and PINECONE_INDEX_NAME must be set in environment variables.")
        return self._index

    @property
    def pc(self):
        """Lazy loader for the Pinecone client (used for Inference API)."""
        if self._pc is None:
            self._initialize_client()
            if self._pc is None:
                raise ValueError("PINECONE_API_KEY must be set in environment variables.")
        return self._pc

    def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for the given text using Pinecone's Inference API.
        
        Args:
            text: The text to embed.
            
        Returns:
            A list of 1024 floats representing the embedding vector.
        """
        try:
            # Using Pinecone's Integrated Inference API
            embeddings = self.pc.inference.embed(
                model=MODEL_NAME,
                inputs=[text],
                parameters={"input_type": "query"}
            )
            return embeddings[0].values
        except Exception as e:
            # Basic error handling for API timeouts or connection issues
            print(f"Error generating embedding via Pinecone Inference: {e}")
            raise

    def upsert_document(self, doc_id: str, text: str, user_id: int, repo_id: int, metadata: Optional[Dict[str, Any]] = None):
        """
        Upserts a document into Pinecone using server-side inference.
        The text is stored in metadata, and Pinecone embeds it automatically.
        
        Args:
            doc_id: Unique identifier for the document.
            text: The raw text content to be stored and indexed.
            user_id: ID of the user owning the repository.
            repo_id: ID of the repository.
            metadata: Additional metadata to store with the vector.
        """
        namespace = f"user_{user_id}_repo_{repo_id}"
        
        # Prepare metadata: include raw text and ownership IDs
        meta = metadata.copy() if metadata else {}
        meta.update({
            "text": text,
            "user_id": user_id,
            "repo_id": repo_id
        })

        try:
            # Inference-based upsert: passing text in metadata
            self.index.upsert(
                vectors=[
                    {
                        "id": str(doc_id),
                        "metadata": meta
                    }
                ],
                namespace=namespace
            )
        except Exception as e:
            print(f"Error upserting document to namespace {namespace}: {e}")
            raise

    def query_vectors(self, query_text: str, user_id: int, repo_id: int, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Performs a dual-namespace search in both user-specific and system_docs (global) namespaces.
        Uses concurrent requests for efficiency and merges unique results sorted by similarity score.
        
        Args:
            query_text: The natural language query.
            user_id: The ID of the user.
            repo_id: The ID of the repository.
            top_k: Number of unique results to return.
            
        Returns:
            A merged and sorted list of top match records (top 5 unique matches).
        """
        user_namespace = f"user_{user_id}_repo_{repo_id}"
        system_namespace = "system_docs"

        def _search_namespace(namespace: str):
            try:
                # Server-side inference query via search method
                # Using vector=[] and inputs={'text': ...} as requested
                response = self.index.search(
                    namespace=namespace,
                    query={
                        "inputs": {"text": query_text},
                        "top_k": top_k,
                        "vector": []
                    }
                )
                return response
            except Exception as e:
                print(f"Warning: Search in namespace {namespace} failed: {e}")
                return None

        namespaces = [user_namespace, system_namespace]
        all_matches = []

        # Dual concurrent searches
        with concurrent.futures.ThreadPoolExecutor(max_workers=len(namespaces)) as executor:
            search_futures = [executor.submit(_search_namespace, ns) for ns in namespaces]
            for future in concurrent.futures.as_completed(search_futures):
                response = future.result()
                # Process response; Integrated inference results are usually in 'results' or 'matches'
                # depending on the specific response object structure of the SDK version
                if response:
                    # In newer Pinecone SDKs, search returns a response with matches per namespace
                    # but since we call it per namespace, we look for matches.
                    if hasattr(response, 'matches'):
                        all_matches.extend(response.matches)
                    elif hasattr(response, 'results') and response.results:
                        # Handle case where results is a list of namespace results
                        for res in response.results:
                            if hasattr(res, 'matches'):
                                all_matches.extend(res.matches)

        # Merge results, remove duplicates by ID, keep the one with the highest score
        unique_matches = {}
        for match in all_matches:
            # Handle both dictionary and object-like return types
            m_id = match.get('id') if isinstance(match, dict) else getattr(match, 'id', None)
            m_score = match.get('score', 0) if isinstance(match, dict) else getattr(match, 'score', 0)
            
            if m_id:
                if m_id not in unique_matches or m_score > (unique_matches[m_id].get('score', 0) if isinstance(unique_matches[m_id], dict) else getattr(unique_matches[m_id], 'score', 0)):
                    unique_matches[m_id] = match

        # Sort by score descending
        def get_score(m):
            return m.get('score', 0) if isinstance(m, dict) else getattr(m, 'score', 0)

        sorted_results = sorted(unique_matches.values(), key=get_score, reverse=True)
        
        # Return top 5 unique results
        return sorted_results[:top_k]

# Global singleton instance for easy import
vector_service = VectorService()
