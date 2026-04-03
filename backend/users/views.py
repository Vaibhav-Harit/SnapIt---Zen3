import requests
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from github import Github
from users.models import UserProfile
from indexer.models import Repository

@api_view(['GET'])
@permission_classes([AllowAny])
def github_login(request):
    url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&scope=repo read:user"
    return redirect(url)

@api_view(['GET'])
@permission_classes([AllowAny])
def github_callback(request):
    code = request.GET.get('code')
    if not code:
        return Response({"error": "Missing code"}, status=status.HTTP_400_BAD_REQUEST)

    token_url = "https://github.com/login/oauth/access_token"
    data = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    try:
        response = requests.post(token_url, json=data, headers=headers)
        access_token = response.json().get('access_token')
    except Exception:
        return Response({"error": "Token exchange failed"}, status=status.HTTP_400_BAD_REQUEST)

    if not access_token:
        return Response({"error": "Failed to get access token"}, status=status.HTTP_401_UNAUTHORIZED)

    g = Github(access_token)
    g_user = g.get_user()
    username = getattr(g_user, 'login', None)
    
    if not username:
        return Response({"error": "Failed to fetch GitHub user"}, status=status.HTTP_401_UNAUTHORIZED)

    user, _ = User.objects.get_or_create(username=username)
    if g_user.email and not user.email:
        user.email = g_user.email
        user.save()

    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.github_token = access_token
    profile.github_id = str(g_user.id)
    profile.save()
    login(request, user)

    repos_data = []
    for r in g_user.get_repos():
        repo_obj, _ = Repository.objects.update_or_create(
            repo_id=r.id,
            owner=profile,
            defaults={
                'name': r.full_name,
                'default_branch': r.default_branch
            }
        )
        repos_data.append({
            "name": repo_obj.name, 
            "id": repo_obj.repo_id, 
            "branch": repo_obj.default_branch
        })

    return Response({"repos": repos_data})
