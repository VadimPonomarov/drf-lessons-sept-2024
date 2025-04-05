from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

from core.services.jwt import ActivateToken
from core.services.jwt import JwtService

UserModel = get_user_model()


# Fixtures
@pytest.fixture
def inactive_user(db):
    return UserModel.objects.create_user(
        email="inactiveuser@example.com",
        password="password123",
        is_active=False
    )


@pytest.fixture
def active_user(db):
    return UserModel.objects.create_user(
        email="activeuser@example.com",
        password="password123",
        is_active=True
    )


@pytest.fixture
def valid_token(inactive_user):
    return JwtService.create_token(inactive_user, ActivateToken)


@pytest.fixture
def invalid_token():
    return "invalid-token"


# Tests
@pytest.mark.django_db
def test_successful_user_activation(inactive_user, valid_token):
    """
    Test successful user activation with a valid token.
    """
    client = APIClient()
    url = f"/api/users/activate/?token={valid_token}"  # Ensure valid JWT token

    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK
    # assert response.data["message"] == "User activated successfully"

    inactive_user.refresh_from_db()
    assert inactive_user.is_active is True


@pytest.mark.django_db
def test_user_already_active(active_user):
    client = APIClient()
    valid_token = JwtService.create_token(active_user, ActivateToken)
    url = f"/api/users/activate/?token={valid_token}"

    response = client.get(url)

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_activation_missing_token():
    client = APIClient()
    url = "/api/users/activate/"

    response = client.get(url)

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_activation_invalid_token(invalid_token):
    client = APIClient()
    url = f"/api/users/activate/?token={invalid_token}"

    with patch("core.services.jwt.JwtService.verify_token",
               side_effect=ValueError("Invalid token")):
        response = client.get(url)

    assert response.status_code == status.HTTP_400_BAD_REQUEST

