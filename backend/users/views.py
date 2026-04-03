import requests
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse, HttpResponseBadRequest
from django.contrib.auth.models import User
from django.contrib.auth import login
from github import Github
from .models import UserProfile

def github_login(request):
    url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&scope=repo read:user"
    return redirect(url)

def github_callback(request):
    code = request.GET.get('code')
    if not code:
        return HttpResponseBadRequest("Missing code")

    # Exchange code for token
    token_url = "https://github.com/login/oauth/access_token"
    data = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "code": code,
    }
    headers = {"Accept": "application/json"}
    response = requests.post(token_url, json=data, headers=headers)
    access_token = response.json().get('access_token')

    if not access_token:
        return JsonResponse({"error": "Failed to get access token"}, status=401)

    # Initialize PyGithub and get user
    g = Github(access_token)
    g_user = g.get_user()
    username = getattr(g_user, 'login', None)
    
    if not username:
        return JsonResponse({"error": "Failed to fetch user from GitHub"}, status=401)

    # Handle Django authentication
    user, _ = User.objects.get_or_create(username=username)
    if g_user.email:
        user.email = g_user.email
        user.save()

    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.github_token = access_token
    profile.save()

    login(request, user)

    # Return fetched repos
    repos = [{"name": r.name, "id": r.id, "branch": r.default_branch} for r in g_user.get_repos()]
    return JsonResponse({"repos": repos})

