from django.urls import path

from apps.chat.consumer import ChatConsumer

websocket_urlpatterns =[
    path("<str:room>/", ChatConsumer.as_asgi())
]