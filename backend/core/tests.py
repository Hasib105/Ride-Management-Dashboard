from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class UserRegistrationTests(APITestCase):
    
    def test_user_registration_success(self):
        url = reverse('register')
        data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            're_password': 'testpassword'
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_user_registration_password_mismatch(self):
        url = reverse('register')
        data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            're_password': 'differentpassword'
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_user_registration_short_password(self):
        url = reverse('register')
        data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'short',
            're_password': 'short'
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_user_registration_username_taken(self):
        User.objects.create_user(
            email='existinguser@example.com',
            username='testuser',
            password='testpassword'
        )
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'username': 'testuser',
            'password': 'testpassword',
            're_password': 'testpassword'
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_user_registration_email_taken(self):
        User.objects.create_user(
            email='existinguser@example.com',
            username='existinguser',
            password='testpassword'
        )
        url = reverse('register')
        data = {
            'email': 'existinguser@example.com',
            'username': 'newuser',
            'password': 'testpassword',
            're_password': 'testpassword'
        }
        response = self.client.post(url, data=data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

class UrlsTestCase(APITestCase):
    
    @classmethod
    def setUpTestData(cls):
        # Create a user for authentication tests
        cls.user = User.objects.create_user(username='testuser', password='testpassword', email='testuser@example.com')

    def test_login_url(self):
        url = reverse('token_obtain_pair')
        response = self.client.post(url, data={
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_refresh_token_url(self):
        # First, log in to obtain a token
        login_url = reverse('token_obtain_pair')
        response = self.client.post(login_url, data={
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        refresh_token = response.data['refresh']

        url = reverse('token_refresh')
        response = self.client.post(url, data={'refresh': refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_url(self):
        url = reverse('logout')
        self.client.login(username='testuser', password='testpassword')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_driver_status_count_url(self):
        url = reverse('driver-status-count')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_driver_locations_url(self):
        url = reverse('driver-locations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_trip_statistics_url(self):
        url = reverse('trip-statistics')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_earnings_report_url(self):
        url = reverse('earnings-report')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class WebhookTestCase(APITestCase):

    def test_webhook_endpoint(self):
        url = reverse('your_webhook_url_name')  # Replace with your actual webhook URL name
        # Sample payload to simulate the webhook call
        payload = {
            'event': 'driver_location_updated',
            'data': {
                'driver_id': 1,
                'location': {
                    'latitude': 12.34,
                    'longitude': 56.78
                }
            }
        }
        
        # Send the POST request to the webhook URL
        response = self.client.post(url, data=json.dumps(payload), content_type='application/json')
        
        # Check the response status
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # or appropriate status for your webhook
        
        # Optionally check the expected outcome
        # self.assertTrue(<your_condition_to_check_if_webhook_processed_correctly>)