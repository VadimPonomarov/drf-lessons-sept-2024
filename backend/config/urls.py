"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.urls import path
from django.urls.conf import include

from apps.users.urls import urlpatterns as users_urls
from . import settings
from .docs.urls import urlpatterns as docs_urls
from apps.auth.urls import urlpatterns as auth_urls

urlpatterns = [
    path("api/", include([
        path("users/", include(users_urls)),
        path("auth/", include(auth_urls)),
    ])),
]

urlpatterns += docs_urls