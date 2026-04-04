from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Repository, Snap
from users.models import UserProfile
from .services.crawler import CrawlerService
from .services.vision import VisionService
from .services.vector_service import VectorService
import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def trigger_scan(request):
    repo_id = request.data.get('repo_id')
    if not repo_id:
        return Response({"error": "repo_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    profile = get_object_or_404(UserProfile, user=request.user)
    repo = get_object_or_404(Repository, repo_id=repo_id, owner=profile)

    if not profile.github_token:
        return Response({"error": "GitHub token not found. Please re-authenticate."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        # Step 1: Crawler extracts raw content (utf-8 decoded)
        crawler = CrawlerService()
        raw_files = crawler.get_raw_content(repo.name, profile.github_token)
        
        # Step 2: Vector service processes, chunks (1000/200), and indexes using Llama prefixing
        vector_service = VectorService()
        vector_service.process_and_index_repo(raw_files, str(repo.repo_id))
        
        return Response({
            "message": "Repository indexed successfully",
            "total_files": len(raw_files)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Scan Trigger Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def snap_debugger(request):
    """
    Snap Multi-Modal Debugger View.
    Extracts text from image or uses text payload, then performs vector search.
    """
    image_file = request.FILES.get('image')
    text_payload = request.data.get('text')
    repo_id = request.data.get('repo_id')

    if not repo_id:
        return Response({"error": "repo_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    final_text = ""
    # 1. Vision Service: Extract text from image or use text payload
    if image_file:
        vision_service = VisionService()
        final_text = vision_service.extract_text(image_file)
    elif text_payload:
        final_text = text_payload
    else:
        return Response({"error": "No image or text payload provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 2. Vector Search Service: Perform search in private and public namespaces
        search_service = VectorService()
        merged_results = search_service.search(final_text, repo_id)
        
        # 3. Log the query in the 'Snap' PostgreSQL model
        # Using json.dumps to ensure proper string formatting for the response field
        # vector_id stores the ID of the top match for reference
        top_match = merged_results[0] if merged_results else {}
        m_id = top_match.get('id') if isinstance(top_match, dict) else getattr(top_match, 'id', "none")
        
        # Check if the result involves public knowledge for is_global flag
        # We handle both dictionary and object-like return types depending on SDK version
        def get_namespace(m):
            meta = m.get('metadata', {}) if isinstance(m, dict) else getattr(m, 'metadata', {})
            return meta.get('namespace', '')

        is_global = any(get_namespace(m) == 'public' for m in merged_results)

        snap = Snap.objects.create(
            query=final_text,
            response=json.dumps(merged_results, ensure_ascii=False),
            vector_id=str(m_id),
            is_global=is_global
        )

        # 4. Return the results
        return Response({
            "query": final_text,
            "context": merged_results
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Debugger Service Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
