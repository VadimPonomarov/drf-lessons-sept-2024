import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

# Fixtures for creating sample users in the database:
@pytest.fixture
def normal_user(db):
    user = User.objects.create_user(
        email="normal@example.com",
        password="password",
        is_active=True  # Explicitly set this to True
    )
    return user

@pytest.fixture
def another_user(db):
    user = User.objects.create_user(
        email="other@example.com",
        password="password",
        is_active=True  # Explicitly set this to True
    )
    return user

@pytest.fixture
def superuser(db):
    user = User.objects.create_superuser(
        email="admin@example.com",
        password="password",
        is_active=True  # Explicitly set this to True
    )
    return user



@pytest.mark.django_db
def test_owner_can_retrieve_detail(normal_user):
    """
    Test that the owner (or the same user) can retrieve their own details.
    """
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = f"/api/users/{normal_user.pk}/"
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK
    data = response.data
    # Check that the email in the payload matches the owner’s email.
    assert data.get("email") == normal_user.email


@pytest.mark.django_db
def test_other_user_cannot_retrieve_detail(normal_user, another_user):
    """
    Test that a non-owner (and non-superuser) is forbidden to view the details
    of another user.
    """
    client = APIClient()
    client.force_authenticate(user=another_user)
    url = f"/api/users/{normal_user.pk}/"
    response = client.get(url)
    # Expect a 403 Forbidden response.
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_superuser_can_retrieve_detail(normal_user, superuser):
    """
    Test that a superuser can retrieve the details of any user.
    """
    client = APIClient()
    client.force_authenticate(user=superuser)
    url = f"/api/users/{normal_user.pk}/"
    response = client.get(url)
    assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_owner_can_update_detail(normal_user):
    """
    Test that the owner can update their own profile details.
    """
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = f"/api/users/{normal_user.pk}/"
    update_data = {"profile": {"name": "UpdatedName"}}
    # Use format='json' to handle nested data
    response = client.patch(url, data=update_data, format="json")
    assert response.status_code == status.HTTP_200_OK
    data = response.data
    assert data["profile"]["name"] == "UpdatedName"




@pytest.mark.django_db
def test_other_user_cannot_update_detail(normal_user, another_user):
    """
    Test that a user who is not the owner (and is not a superuser) cannot update another user's details.
    """
    client = APIClient()
    client.force_authenticate(user=another_user)
    url = f"/api/users/{normal_user.pk}/"
    update_data = {"first_name": "ShouldNotUpdate"}
    response = client.patch(url, data=update_data, format="multipart")
    # Expect a 403 Forbidden response.
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_owner_can_delete_detail(normal_user):
    """
    Test that the owner can delete their own account.
    """
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = f"/api/users/{normal_user.pk}/"
    response = client.delete(url)
    # Usually, deletion returns HTTP 204 No Content.
    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.django_db
def test_other_user_cannot_delete_detail(normal_user, another_user):
    """
    Test that a user who is not the owner (and is not a superuser) cannot delete another user's account.
    """
    client = APIClient()
    client.force_authenticate(user=another_user)
    url = f"/api/users/{normal_user.pk}/"
    response = client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_superuser_can_delete_detail(normal_user, superuser):
    """
    Test that a superuser can delete any user.
    """
    client = APIClient()
    client.force_authenticate(user=superuser)
    url = f"/api/users/{normal_user.pk}/"
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
