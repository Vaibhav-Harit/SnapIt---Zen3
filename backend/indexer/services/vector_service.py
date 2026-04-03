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

    @property
    def pc(self):
        """Lazy loader for the Pinecone client."""
        if self._pc is None:
            self._initialize_client()
            if self._pc is None:
                raise ValueError("PINECONE_API_KEY must be set in environment variables.")
        return self._pc

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

    def process_and_index_repo(self, raw_content_list: List[Dict[str, Any]], repo_id: str):
        """
        Process raw repo content: normalized cleaning, chunking, and Llama prefixing.
        Then push to Pinecone with server-side inference.
        """
        all_vectors = []
        for item in raw_content_list:
            file_path = item['file_path']
            content = item['content']
            
            # 1. TEXT CLEANING: Replace \r\n (Windows) with \n (Unix) for normalization
            content = content.replace('\r\n', '\n')
            
            # 2. CHUNKING: 1000-character chunks with a 200-character overlap
            chunk_size = 1000
            overlap = 200
            chunks = []
            
            if len(content) <= chunk_size:
                chunks.append(content)
            else:
                start = 0
                while start < len(content):
                    end = start + chunk_size
                    chunk = content[start:end]
                    chunks.append(chunk)
                    # Next chunk starts 'overlap' characters before 'end'
                    start += (chunk_size - overlap)
                    if start >= len(content):
                        break
            
            # 3. PREFIXING and Vector Prep
            for i, chunk_text in enumerate(chunks):
                # For Llama-text-embed-v2, prefix every passage string with "passage: "
                prefixed_text = f"passage: {chunk_text}"
                
                # Metadata: { file_path, repo_id, content: original_chunk_text }
                metadata = {
                    "file_path": file_path,
                    "repo_id": repo_id,
                    "content": chunk_text  # original raw text
                }
                
                # ID FORMAT: Generate unique IDs as f"{repo_id}_{file_path}_{chunk_index}"
                vector_id = f"{repo_id}_{file_path}_{i+1}"
                
                # This 'text' field is used for server-side Integrated Inference
                # We store the Llama-prefixed version as 'text' for embedding
                all_vectors.append({
                    "id": vector_id,
                    "metadata": metadata,
                    "text": prefixed_text
                })

        # 4. EXECUTION: Push these vectors into the namespace f"repo_{repo_id}"
        namespace = f"repo_{repo_id}"
        self.upsert_with_inference(all_vectors, namespace)

    def upsert_with_inference(self, vectors: List[Dict[str, Any]], namespace: str):
        """
        Pushes vectors into Pinecone using server-side inference.
        Batches the upserts into groups of 100 to avoid rate limits and optimize speed.
        """
        batch_size = 100
        for i in range(0, len(vectors), batch_size):
            batch = vectors[i : i + batch_size]
            try:
                # Building the list of records for upsert
                upsert_data = []
                for v in batch:
                    # Map prefixed text to metadata for Integrated Inference if model is configured
                    v['metadata']['text'] = v['text'] 
                    
                    upsert_data.append({
                        "id": v['id'],
                        "metadata": v['metadata']
                    })
                
                self.index.upsert(vectors=upsert_data, namespace=namespace)
                print(f"Index Success: Upserted batch of {len(upsert_data)} to {namespace}")
            except Exception as e:
                print(f"Index Error: Failed to push batch to {namespace}: {e}")
                raise

# Global instance for easy import
vector_service = VectorService()
