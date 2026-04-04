from django.urls import path
from . import views

urlpatterns = [
    path('github/login/', views.github_login, name='github_login'),
    path('github/callback/', views.github_callback, name='github_callback'),
    path('snap/preview/', views.generate_global_preview, name='generate_global_preview'),
    path('snap/chat/', views.chat_with_groq, name='chat_with_groq'),
]
