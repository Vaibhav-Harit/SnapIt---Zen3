#TEST CASES

import json
from unittest.mock import patch, MagicMock
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from .models import UserProfile, Repository, Snap, ThreadMessage

class SnapitIntegrationTests(APITestCase):
    """
    Integration tests for the Snapit conversational debugger.
    Mocking Groq and Pinecone to ensure tests are isolated and reliable.
    """

    def setUp(self):

        self.user = User.objects.create_user(username='testuser', password='password123')
        self.profile = UserProfile.objects.create(user=self.user, github_id='12345', github_token='gh_token')
        
        self.repo = Repository.objects.create(
            repo_id=98765, 
            name='test/repo', 
            default_branch='main', 
            owner=self.profile
        )
        
        self.snap = Snap.objects.create(
            repo=self.repo,
            query='What is wrong?',
            response='Initial response',
            vector_id='mock_vector_hash',
            status='open'
        )
        
        self.client.force_authenticate(user=self.user)

    @patch('users.views.Groq')
    @patch('users.views.VectorService.query_pinecone')
    def test_chat_with_groq_success(self, mock_pinecone, mock_groq_class):
        """
        Verify that chat_with_groq successfully interacts with Groq and saves history.
        """

        mock_pinecone.return_value = "Mocked code chunk: def error(): pass"
        
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(message=MagicMock(content=json.dumps({
                "fixed_code": "print('hello')",
                "target_file": "test.py",
                "chat_response": "Fixed it!"
            })))
        ]
        mock_client.chat.completions.create.return_value = mock_response
        mock_groq_class.return_value = mock_client
        
        url = reverse('chat_with_groq')
        data = {
            "snap_id": self.snap.id,
            "message": "How do I fix this null pointer?"
        }
        
        initial_msg_count = ThreadMessage.objects.filter(snap=self.snap).count()
        
        print(f"\n{'='*20} CASE 1: SUCCESSFUL CHAT {'='*20}")
        print(f"REQUEST INPUT (to API):\n{json.dumps(data, indent=2)}")
        print(f"\nMOCK LLM RESPONSE (from Groq):\n{json.dumps({
                "fixed_code": "print('hello')",
                "target_file": "test.py",
                "chat_response": "Fixed it!"
            }, indent=2)}")
            
        response = self.client.post(url, data, format='json')
        print(f"\nACTUAL API OUTPUT:\n{json.dumps(response.data, indent=2)}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['fixed_code'], "print('hello')")
        self.assertEqual(response.data['chat_response'], "Fixed it!")
        
        # Verify Database Persistence: 1 from User + 1 from AI = +2 messages
        new_msg_count = ThreadMessage.objects.filter(snap=self.snap).count()
        self.assertEqual(new_msg_count, initial_msg_count + 2)
        print("\n\n")

    @patch('users.views.Groq')
    def test_generate_global_preview_success(self, mock_groq_class):
        """
        Verify that generate_global_preview summarizes thread history correctly using Groq.
        """
        # Populate thread history first
        ThreadMessage.objects.create(snap=self.snap, role='user', content='Error in auth')
        ThreadMessage.objects.create(snap=self.snap, role='ai', content='Check the token')
        
        # Mock Groq Summary Response
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices = [
            MagicMock(message=MagicMock(content=json.dumps({
                "generic_error": "Auth validation error",
                "generic_resolution": "Verify JWT token manually"
            })))
        ]
        mock_client.chat.completions.create.return_value = mock_response
        mock_groq_class.return_value = mock_client
        
        # Define Request Payload
        url = reverse('generate_global_preview')
        data = {"snap_id": self.snap.id}
        
        # POST Request
        print(f"\n{'='*20} CASE 2: GLOBAL PREVIEW {'='*20}")
        print(f"REQUEST INPUT (to API):\n{json.dumps(data, indent=2)}")
        print(f"\nMOCK LLM RESPONSE (from Groq):\n{json.dumps({
                "generic_error": "Auth validation error",
                "generic_resolution": "Verify JWT token manually"
            }, indent=2)}")
            
        response = self.client.post(url, data, format='json')
        print(f"\nACTUAL API OUTPUT:\n{json.dumps(response.data, indent=2)}")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['generic_error'], "Auth validation error")
        self.assertEqual(response.data['generic_resolution'], "Verify JWT token manually")
        print("\n\n")

    def test_chat_with_groq_missing_params(self):
        """
        Ensure 400 error is returned when required parameters are missing.
        """
        url = reverse('chat_with_groq')
        data = {"snap_id": self.snap.id}
        print(f"\n{'='*20} CASE 3: MISSING PARAMETERS {'='*20}")
        print(f"REQUEST INPUT (to API):\n{json.dumps(data, indent=2)}")
        print("\nEXPECTED BEHAVIOR: Error 400 due to missing 'message'")
        
        response = self.client.post(url, data, format='json')
        print(f"\nACTUAL API OUTPUT:\n{json.dumps(response.data, indent=2)}")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        print("\n\n")
