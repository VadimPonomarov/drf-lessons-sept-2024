from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer

from config.extra_config.logger_config import logger
from core.services.jwt import JwtService

User = get_user_model()


class ChatConsumer(GenericAsyncAPIConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.user_name = None

    async def connect(self):
        try:
            headers = dict(self.scope["headers"])
            authorization_header = headers.get(b'authorization', None)

            if not authorization_header:
                logger.error("Authorization header missing.")
                await self.close()
                return

            try:
                token = authorization_header.decode().split(" ")[1]
                logger.info(f"Extracted token: {token}")

                validated_user = await sync_to_async(JwtService.validate_any_token)(
                    token)
                self.scope["user"] = validated_user

                user_from_db = await sync_to_async(get_object_or_404)(User,
                                                                      pk=validated_user.id)
                user_name = await sync_to_async(
                    lambda: user_from_db.profile.name if user_from_db.profile.name
                    else validated_user.email.split("@")[0])()

                self.user_name = user_name
                self.room_name = self.scope['url_route']['kwargs']['room']

                logger.info(
                    f"User with email {validated_user.email} connected to chat.")
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


            except IndexError:
                logger.error("Invalid Authorization header format.")
                await self.close()
                return
            except Exception as e:
                logger.error(f"Error in connect(): {e}")
                await self.close()

        except Exception as e:
            logger.error(f"Unexpected error in connect(): {e}")
            await self.close()

    async def chat_message(self, data):
        await self.send_json(data)

    @action()
    async def send_message(self, data, request_id, action):
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

