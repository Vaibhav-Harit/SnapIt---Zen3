import base64
from github import Github
import pathlib

class CrawlerService:
    SUPPORTED_EXTENSIONS = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.cs': 'csharp',
        '.go': 'go',
        '.rb': 'ruby',
        '.rs': 'rust',
        '.php': 'php',
        '.html': 'html',
        '.css': 'css',
        '.md': 'markdown'
    }

    IGNORED_DIRS = {'.git', 'node_modules', 'venv', 'env', '__pycache__'}
    IGNORED_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.exe', '.dll', '.so', '.dylib', '.zip', '.tar', '.gz'}
    MAX_FILE_SIZE = 500000

    def __init__(self, chunk_size=3000, overlap=450):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_code(self, text, filename):
        if not text:
            return []

        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = start + self.chunk_size
            if end >= text_len:
                chunks.append(text[start:])
                break

            split_window = text[end - self.overlap : end]
            split_pos = end

            idx = split_window.rfind('\nclass ')
            if idx == -1:
                idx = split_window.rfind('\ndef ')
            if idx == -1:
                idx = split_window.rfind('\n\n')

            if idx != -1:
                split_pos = (end - self.overlap) + idx + 1

            chunks.append(text[start:split_pos])
            start = split_pos - self.overlap
            if start < 0:
                start = 0

        return chunks

    def crawl(self, repo_name, token, repo_id):
        g = Github(token)
        repo = g.get_repo(repo_name)
        tree = repo.get_git_tree(repo.default_branch, recursive=True)
        
        all_chunks = []

        for element in tree.tree:
            if element.type != "blob" or element.size > self.MAX_FILE_SIZE:
                continue

            path_obj = pathlib.Path(element.path)
            
            if any(part in self.IGNORED_DIRS for part in path_obj.parts):
                continue

            ext = path_obj.suffix.lower()
            if ext in self.IGNORED_EXTENSIONS:
                continue

            try:
                blob = repo.get_git_blob(element.sha)
                content = base64.b64decode(blob.content).decode('utf-8')
            except Exception:
                continue

            language = self.SUPPORTED_EXTENSIONS.get(ext, 'plaintext')
            file_chunks = self.chunk_code(content, str(path_obj))

            for i, chunk in enumerate(file_chunks):
                all_chunks.append({
                    "file_path": str(path_obj),
                    "content": chunk,
                    "chunk_index": i + 1,
                    "metadata": {
                        "repo_id": repo_id,
                        "language": language
                    }
                })

        return all_chunks

    def get_raw_content(self, repo_name, token):
        """
        Extract raw file contents from the repository without chunking.
        Returns a list of {"file_path": str, "content": str}.
        Uses utf-8 for string operations context-specific safe decoding.
        """
        g = Github(token)
        repo = g.get_repo(repo_name)
        tree = repo.get_git_tree(repo.default_branch, recursive=True)
        
        raw_files = []

        for element in tree.tree:
            # Only index blobs within the maximum size limit
            if element.type != "blob" or element.size > self.MAX_FILE_SIZE:
                continue

            path_obj = pathlib.Path(element.path)
            # Skip ignored directories
            if any(part in self.IGNORED_DIRS for part in path_obj.parts):
                continue

            # Only index supported extensions
            ext = path_obj.suffix.lower()
            if ext in self.IGNORED_EXTENSIONS or ext not in self.SUPPORTED_EXTENSIONS:
                continue

            try:
                blob = repo.get_git_blob(element.sha)
                # Standardize to utf-8 as required for Windows local refinement
                content = base64.b64decode(blob.content).decode('utf-8')
                
                raw_files.append({
                    "file_path": str(path_obj),
                    "content": content
                })
            except Exception as e:
                print(f"Error fetching blob {element.path}: {e}")
                continue

        return raw_files
