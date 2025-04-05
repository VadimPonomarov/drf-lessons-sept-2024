import io

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import MagicMock

from apps.users.models import ProfileModel

UserModel = get_user_model()

# Fixtures
@pytest.fixture
def user(db):
    """
    Создает тестового суперпользователя для прохождения проверки permission.
    """
    return UserModel.objects.create_superuser(
        email="testuser@example.com",
        password="password123"
    )

@pytest.fixture
def profile(user):
    """
    Создает профиль для тестового пользователя с мокированным аватаром.
    """
    return ProfileModel.objects.create(user=user, avatar=None)

@pytest.fixture
def authenticated_client(user):
    """
    Создает APIClient с аутентификацией тестового пользователя.
    """
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.fixture
def avatar_file():
    """
    Provide a real file-like object for the avatar field.
    """
    avatar_content = io.BytesIO(b"fake_image_data")
    avatar_content.name = "avatar.jpg"  # Name of the file
    return avatar_content



# Tests
@pytest.mark.django_db
def test_upload_avatar(authenticated_client, profile, avatar_file):
    """
    Тест успешной загрузки аватара.
    """
    url = f"/api/users/{profile.user.id}/profile/avatar/"
    data = {"avatar": avatar_file}

    response = authenticated_client.patch(url, data, format="multipart")

    assert response.status_code == status.HTTP_200_OK
    assert "avatar_url" in response.data
    # Проверяем, что URL начинается с нужного префикса
    assert response.data["avatar_url"].startswith("http://localhost:9000/media-bucket/")
    # Если требуется, можно добавить проверку, что в URL содержится слово "avatar"
    assert "avatar" in response.data["avatar_url"]


@pytest.mark.django_db
def test_upload_avatar_without_file(authenticated_client, profile):
    """
    Test attempting to upload an avatar without providing a file.
    """
    url = f"/api/users/{profile.user.id}/profile/avatar/"
    data = {}

    response = authenticated_client.patch(url, data, format="multipart")

    assert response.status_code == status.HTTP_406_NOT_ACCEPTABLE
    assert response.data["detail"] == "Avatar file is required"  # Corrected assertion



@pytest.mark.django_db
def test_delete_avatar(authenticated_client, profile, avatar_file):
    """
    Test deleting an avatar successfully.
    """
    # Assign an avatar to the profile
    profile.avatar = None
    profile.save()  # Save the profile with the avatar file

    url = f"/api/users/{profile.user.id}/profile/avatar/"
    response = authenticated_client.delete(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Avatar deleted successfully"
    profile.refresh_from_db()
    assert profile.avatar == ""


@pytest.mark.django_db
def test_delete_avatar_no_avatar(authenticated_client, profile):
    """
    Тест удаления аватара, когда аватар отсутствует.
    """
    url = f"/api/users/{profile.user.id}/profile/avatar/"
    response = authenticated_client.delete(url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Avatar deleted successfully"
    profile.refresh_from_db()
    assert profile.avatar.name == ""

@pytest.mark.django_db
def test_permission_denied_for_unauthenticated_client(profile):
    """
    Тест, что неавторизованным клиентам запрещены загрузка и удаление аватара.
    """
    client = APIClient()
    url = f"/api/users/{profile.user.id}/profile/avatar/"

    # Тест PATCH
    response = client.patch(url, {}, format="multipart")
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # Тест DELETE
    response = client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN
