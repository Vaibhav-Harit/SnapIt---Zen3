from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    github_id = models.CharField(max_length=255, null=True, blank=True)
    github_token = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Repository(models.Model):
    repo_id = models.BigIntegerField()
    name = models.CharField(max_length=255)
    default_branch = models.CharField(max_length=255)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='repositories')

    def __str__(self):
        return self.name

class Snap(models.Model):
    query = models.TextField()
    response = models.TextField()
    vector_id = models.CharField(max_length=255)
    is_global = models.BooleanField(default=False)

    def __str__(self):
        return f"Snap: {self.vector_id}"

