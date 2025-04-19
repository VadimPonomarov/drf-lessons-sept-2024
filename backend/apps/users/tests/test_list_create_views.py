import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch

User = get_user_model()

# Valid user creation data.
VALID_USER_DATA = {
    "email": "testuser@example.com",
    "password": "password123",
    "profile": {
        "name": "John",
        "surname": "Doe",
        "age": 30
    }
}

# Invalid user creation data (bad email and empty password).
INVALID_USER_DATA = {
    "email": "not-an-email",
    "password": ""
}

@pytest.mark.django_db
def test_list_users_view_requires_staff():
    """
    Test that an unauthenticated request to the user list endpoint (/api/users/)
    is forbidden (HTTP 403) when the view requires admin permissions.
    """
    client = APIClient()

    # Unauthenticated request; should return 403 Forbidden.
    response = client.get("/api/users/")
    assert response.status_code == status.HTTP_403_FORBIDDEN

@pytest.mark.django_db
@patch("apps.users.serializers.send_email_service", autospec=True)
@patch("apps.users.serializers.JwtService.create_token", autospec=True, return_value="dummy-token")
def test_create_user_view_valid_data(mock_create_token, mock_send_email):
    """
    Test that creating a user with valid data returns HTTP 201 Created.
    The response should contain the correct email and profile data, and the password field must not be present.
    """
    client = APIClient()
    response = client.post("/api/users/create/", data=VALID_USER_DATA, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    data = response.data
    assert data["email"] == VALID_USER_DATA["email"]
    assert "profile" in data and data["profile"] is not None
    assert "password" not in data  # The password field must be write-only.

@pytest.mark.django_db
def test_create_user_view_invalid_data():
    """
    Test that submitting invalid user data (invalid email and empty password) to the create endpoint
    returns HTTP 400 Bad Request with relevant error details.
    """
    client = APIClient()
    response = client.post("/api/users/create/", data=INVALID_USER_DATA, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    errors = response.data
    assert "email" in errors
    assert "password" in errors

@pytest.mark.django_db
def test_email_validation_duplicate(admin_user):
    """
    Test that creating a user with an existing email returns appropriate error message.
    """
    client = APIClient()
    client.force_authenticate(user=admin_user)
    url = "/api/users/create/"
    
    # Create initial user
    User.objects.create_user(email="duplicate@example.com", password="password123")
    
    # Attempt to create user with same email
    data = {"email": "duplicate@example.com", "password": "password123"}
    response = client.post(url, data, format="json")
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "email" in response.data
    assert "User with this email already exists." in response.data["email"]
