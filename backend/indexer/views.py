from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Repository
from users.models import UserProfile
from .services.crawler import CrawlerService
from .services.vector_service import VectorService

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
        crawler = CrawlerService()
        repo_full_name = repo.name 
        chunks = crawler.crawl(repo_full_name, profile.github_token, repo.repo_id)

        vector_service = VectorService()
        indexed_count = vector_service.index_repository(chunks, repo.repo_id)
        
        return Response({
            "status": "success",
            "message": "Repository indexed successfully",
            "total_chunks": len(chunks),
            "chunks_indexed": indexed_count
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
