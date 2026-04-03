from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('oauth/', include('users.urls')),
    path('api/indexer/', include('indexer.urls')),
]

