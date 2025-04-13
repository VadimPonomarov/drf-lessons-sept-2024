import uuid

from django.contrib.auth import get_user_model
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from config.extra_config.logger_config import logger


User = get_user_model()


class ChatConsumer(GenericAsyncAPIConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.user_name = None

    async def connect(self):
        try:
            self.user_name = self.scope['user_name']
            self.room_name = self.scope['url_route']['kwargs']['room']

            logger.info(
                f"User with email {self.scope['user'].email} connected to chat.")
            logger.info(
                f"User_name: {self.user_name}, Room_name: {self.room_name}.")

            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )
            await self.accept()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "chat_message",
                    "message": f"{self.user_name} has joined the chat."
                }
            )

        except Exception as e:
            logger.error(f"Unexpected error in connect(): {e}")
            await self.close()

    async def chat_message(self, data):
        await self.send_json(data)

    @action()
    async def send_message(self, data, action, request_id=uuid.uuid4()):
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": data,
                "user_name": self.user_name,
                "id": request_id
            }
        )

    async def disconnect(self, code):
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": f"{self.user_name} has left the chat."
            }
        )
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
