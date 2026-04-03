import os
import concurrent.futures
from typing import List, Dict, Any, Optional
from pinecone import Pinecone

# Default model for Integrated Inference
MODEL_NAME = "nvidia/llama-text-embed-v2"

class VectorService:
    """
    Vector Service for Snap Multi-Modal Debugger using Pinecone Integrated Inference.
    Features: Llama-based query formatting, dual-namespace search, and error handling for empty namespaces.
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

    def search(self, raw_query: str, repo_id: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Performs dual searches: 'repo_{repo_id}' (Private code) and 'public' (Global community knowledge).
        Uses Llama-required search string: f"query: {raw_query}"
        
        Args:
            raw_query: The natural language query from Vision or text input.
            repo_id: The ID of the repository to search within.
            top_k: Number of unique results to return.
            
        Returns:
            A merged and sorted list of top match records.
        """
        # Prefix the query as requested for Llama-based logic
        # The model requires this prefix for search queries.
        llama_query = f"query: {raw_query}"
        
        # Target namespaces: private repository and public knowledge
        private_namespace = f"repo_{repo_id}"
        public_namespace = "public"

        def _search_namespace(namespace: str):
            try:
                # Server-side inference query via search method
                # Using vector=[] and inputs={'text': ...} for integrated inference as requested.
                return self.index.search(
                    namespace=namespace,
                    query={
                        "inputs": {"text": llama_query},
                        "top_k": top_k,
                        "vector": [] # Explicit empty vector for server-side inference
                    }
                )
            except Exception as e:
                # Wrapped in try-except to handle non-existent or empty namespaces
                # This prevents the whole debugger from crashing as requested in feedback.
                print(f"Warning: Failed to search namespace '{namespace}': {e}. It may be empty or not initialized yet.")
                return None

        namespaces = [private_namespace, public_namespace]
        all_matches = []

        # Concurrent searches in both namespaces
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_to_ns = {executor.submit(_search_namespace, ns): ns for ns in namespaces}
            for future in concurrent.futures.as_completed(future_to_ns):
                response = future.result()
                if response:
                    # Collect matches from the response object
                    if hasattr(response, 'matches'):
                        all_matches.extend(response.matches)
                    elif isinstance(response, dict) and 'matches' in response:
                        all_matches.extend(response['matches'])
                    elif hasattr(response, 'results'): # Handle cases where response has results field
                        for res in getattr(response, 'results', []):
                            if hasattr(res, 'matches'):
                                all_matches.extend(res.matches)

        # Merge results, remove duplicates by ID, keep the highest score
        unique_matches = {}
        for match in all_matches:
            # Handle both dictionary and object-like return types depending on SDK version
            m_id = match.get('id') if isinstance(match, dict) else getattr(match, 'id', None)
            m_score = match.get('score', 0) if isinstance(match, dict) else getattr(match, 'score', 0)
            
            if m_id:
                if m_id not in unique_matches or m_score > (unique_matches[m_id].get('score', 0) if isinstance(unique_matches[m_id], dict) else getattr(unique_matches[m_id], 'score', 0)):
                    unique_matches[m_id] = match

        # Sort by score descending and return top matches
        def get_score(m):
            return m.get('score', 0) if isinstance(m, dict) else getattr(m, 'score', 0)

        results = sorted(unique_matches.values(), key=get_score, reverse=True)
        return results[:top_k]

# Global instance for easy import
vector_service = VectorService()
