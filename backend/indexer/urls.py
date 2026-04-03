from django.urls import path
from . import views

urlpatterns = [
    path('scan/', views.trigger_scan, name='trigger_scan'),
]
