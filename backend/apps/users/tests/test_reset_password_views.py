import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

@pytest.fixture
def active_user(db):
    user = User.objects.create(
        email="active_user@example.com",
        password="password123",
        is_active=True
    )
    return user


@pytest.fixture
def inactive_user(db):
    user = User.objects.create(
        email="inactive_user@example.com",
        password="password123",
        is_active=False
    )
    return user


@pytest.mark.django_db
def test_reset_password_token_active_user(active_user):
    client = APIClient()
    client.force_authenticate(user=active_user)
    url = f"/api/users/{active_user.pk}/reset-password-token/"
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data.get("message") == "Email with password reset token sent successfully"


@pytest.mark.django_db
def test_reset_password_token_inactive_user(inactive_user):
    client = APIClient()
    client.force_authenticate(user=inactive_user)
    url = f"/api/users/{inactive_user.pk}/reset-password-token/"
    response = client.get(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Permission failure expected.


@pytest.mark.django_db
def test_reset_password_token_unauthorized(active_user):
    client = APIClient()
    url = f"/api/users/{active_user.pk}/reset-password-token/"
    response = client.get(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN  # Permission failure expected.


@pytest.mark.django_db
def test_reset_password_token_expired_token(active_user):
    """
    Test that a request with an expired token returns 401 Unauthorized.
    """
    client = APIClient()
    expired_token = "expired_test_token"  # Simulate an expired token
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {expired_token}")
    url = f"/api/users/{active_user.pk}/reset-password-token/"
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data.get("detail") == "Given token not valid for any token type"
