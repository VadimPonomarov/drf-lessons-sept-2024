from django.urls.conf import path

from apps.chat.consumer import ChatConsumer
from apps.chat.views import WebSocketDocumentationView

urlpatterns = [
    path("<HOST>/api/chat/<str:room>/", WebSocketDocumentationView.as_view()),
]