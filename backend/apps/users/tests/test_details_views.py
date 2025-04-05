import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

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


@pytest.mark.django_db
def test_access_with_expired_token(normal_user):
    """
    Test that accessing an endpoint with an expired token returns 401 Unauthorized.
    """
    client = APIClient()
    expired_token = "expired_test_token"  # Simulate an expired token.
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {expired_token}")
    url = f"/api/users/{normal_user.pk}/"
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data.get("detail") == "Given token not valid for any token type"


@pytest.mark.django_db
def test_update_with_maximum_values(normal_user):
    client = APIClient()
    client.force_authenticate(user=normal_user)
    url = f"/api/users/{normal_user.pk}/"
    update_data = {"profile": {"age": 100}}  # Maximum age allowed
    response = client.patch(url, data=update_data, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["profile"]["age"] == 100


@pytest.mark.django_db
def test_nonexistent_user_access(superuser):
    client = APIClient()
    client.force_authenticate(user=superuser)
    url = "/api/users/9999/"  # Nonexistent user ID
    response = client.get(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_email_validation_success(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)  # Authenticate as admin
    url = "/api/users/create/"
    data = {"email": "valid@example.com", "password": "password123"}
    response = client.post(url, data, format="json")
    assert response.status_code == status.HTTP_201_CREATED


@pytest.mark.django_db
def test_email_validation_invalid_format(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)  # Authenticate as admin
    url = "/api/users/create/"
    data = {"email": "invalid-email", "password": "password123"}
    response = client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_email_validation_duplicate(admin_user):
    client = APIClient()
    client.force_authenticate(user=admin_user)  # Authenticate as admin
    url = "/api/users/create/"
    User.objects.create_user(email="duplicate@example.com", password="password123")
    data = {"email": "duplicate@example.com", "password": "password123"}
    response = client.post(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
