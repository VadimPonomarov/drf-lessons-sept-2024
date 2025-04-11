import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model


@pytest.fixture
def api_client():
    """
    Provides a Rest Framework API client for testing.
    """
    return APIClient()


@pytest.fixture
def create_test_user():
    """
    Creates and returns a test user in the database.
    """
    def _create_test_user(email="testuser@example.com", password="password123", is_active=True):
        User = get_user_model()
        user = User.objects.create_user(email=email, password=password)
        user.is_active = is_active  # Ensure the user is active
        user.save()
        return user
    return _create_test_user


@pytest.mark.django_db
def test_socket_token_authenticated(api_client, create_test_user):
    """
    Verifies token generation for authenticated users.
    """
    # Create and authenticate a user
    email = "testuser@example.com"
    password = "password123"
    user = create_test_user(email=email, password=password)

    # Authenticate the user using the API client
    api_client.force_authenticate(user=user)

    # Make a POST request to the endpoint
    response = api_client.post("/api/auth/socket-token")
    assert response.status_code == status.HTTP_200_OK, "Expected 200 OK for authenticated user"
    assert "token" in response.data, "Token is missing in the response data"
    assert isinstance(response.data["token"], str), "Token should be a string"


@pytest.mark.django_db
def test_socket_token_unauthenticated(api_client):
    """
    Verifies access to the socket token endpoint without authentication.
    """
    # Make a POST request without authenticating
    response = api_client.post("/api/auth/socket-token")
    # Adjusted to expect 403 if 'IsMeUser' denies unauthenticated requests
    assert response.status_code == status.HTTP_403_FORBIDDEN, "Expected 403 Forbidden for unauthenticated user"
    assert "detail" in response.data, "Expected 'detail' key in the response data"
    assert response.data["detail"] == "Authentication credentials were not provided.", "Unexpected error message"


@pytest.mark.django_db
def test_socket_token_forbidden(api_client, create_test_user):
    """
    Verifies that unauthorized access returns a forbidden error.
    """
    # Create a user and mark them as inactive
    email = "inactiveuser@example.com"
    password = "password123"
    user = create_test_user(email=email, password=password, is_active=False)

    # Authenticate the user using the API client
    api_client.force_authenticate(user=user)

    # Make a POST request to the endpoint
    response = api_client.post("/api/auth/socket-token")
    assert response.status_code == status.HTTP_403_FORBIDDEN, "Expected 403 Forbidden for inactive user"
    assert "detail" in response.data, "Expected 'detail' key in the response data"
    assert response.data["detail"] == "You do not have permission to perform this action.", "Unexpected error message"
