import requests
from django.conf import settings
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from github import Github
from .models import UserProfile, Repository, Snap, ThreadMessage
from groq import Groq
import json

import sys
import os
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))
from services.vector_service import VectorService


# ─────────────────────────────────────────────
# GitHub OAuth Views
# ─────────────────────────────────────────────

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


# ─────────────────────────────────────────────
# Global Preview (Groq-powered)
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_global_preview(request):
    snap_id = request.data.get('snap_id')
    if not snap_id:
        return Response({"error": "snap_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    snap = get_object_or_404(Snap, id=snap_id)
    messages = snap.messages.all().order_by('timestamp')

    if not messages.exists():
        return Response({"error": "No messages found in this snap's thread."}, status=status.HTTP_400_BAD_REQUEST)

    thread_text = "\n\n".join([f"[{msg.role.upper()}]: {msg.content}" for msg in messages])

    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "Summarize this debugging session for a public knowledge base. Extract ONLY the core error description and the generic technical resolution. Strip ALL private variables, API keys, repository names, and user data. Return a JSON with exactly two keys: 'generic_error' and 'generic_resolution'."
                },
                {
                    "role": "user",
                    "content": f"Thread History:\n{thread_text}"
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        ai_output = json.loads(chat_completion.choices[0].message.content)
        return Response(ai_output, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ─────────────────────────────────────────────
# Conversational Chat (Groq-powered Thinker)
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def chat_with_groq(request):
    snap_id = request.data.get('snap_id')
    user_message = request.data.get('message')

    if not snap_id or not user_message:
        return Response({"error": "snap_id and message are required."}, status=status.HTTP_400_BAD_REQUEST)

    snap = get_object_or_404(Snap, id=snap_id)

    # Require the Snap to have an associated repository or passed repo_id
    repo_id = request.data.get('repo_id')
    if snap.repo:
        repo_id = snap.repo.repo_id

    if not repo_id:
        return Response({"error": "No associated repository found for this snap."}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Save user message to ThreadMessage
    ThreadMessage.objects.create(snap=snap, role='user', content=user_message)

    # 2. Natively query Pinecone for context
    vector_service = VectorService()
    try:
        retrieved_context = vector_service.query_pinecone(query_text=user_message, repo_id=repo_id, top_k=5)
    except Exception as e:
        retrieved_context = f"Context retrieval unavailable: {str(e)}"

    # 3. Fetch last 5 ThreadMessages for history
    history_messages = snap.messages.all().order_by('-timestamp')[:5]
    history_messages = list(reversed(history_messages))
    history_context = "\n\n".join([f"[{msg.role.upper()}]: {msg.content}" for msg in history_messages])

    # 4. Build system + user messages for Groq
    system_prompt = (
        'You are a senior dev. Use the provided context and history. '
        'Return ONLY raw JSON with keys: "fixed_code", "target_file", "chat_response". '
        'If no code fix is needed, return empty strings for "fixed_code" and "target_file".'
    )

    user_content = (
        f"Retrieved Context:\n{retrieved_context}\n\n"
        f"Thread History:\n{history_context}\n\n"
        f"Current Question: {user_message}"
    )

    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
        )

        raw_content = chat_completion.choices[0].message.content
        ai_output = json.loads(raw_content)
        chat_response = ai_output.get('chat_response', '')

        # 5. Save AI response to ThreadMessage
        ThreadMessage.objects.create(snap=snap, role='ai', content=chat_response)

        return Response(ai_output, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
