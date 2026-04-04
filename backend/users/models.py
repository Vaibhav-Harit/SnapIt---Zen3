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
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="user_repositories")

    def __str__(self):
        return self.name

class Snap(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('resolved', 'Resolved'),
    )
    repo = models.ForeignKey(Repository, on_delete=models.CASCADE, related_name='snaps', null=True, blank=True)
    query = models.TextField()
    response = models.TextField()
    vector_id = models.CharField(max_length=255)
    is_global = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    def __str__(self):
        return f"Snap: {self.vector_id}"

class ThreadMessage(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('ai', 'AI'),
    )
    snap = models.ForeignKey(Snap, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.role}] Thread on {self.snap.vector_id}"
