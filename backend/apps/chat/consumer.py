from asgiref.sync import sync_to_async
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer


from config.extra_config.logger_config import logger
from core.services.jwt import JwtService


class ChatConsumer(GenericAsyncAPIConsumer):
    user_name = None
    room_name = None

    async def connect(self):
        try:
            # Extract the "Authorization" header
            headers = dict(self.scope["headers"])
            authorization_header = headers.get(b'authorization', None)

            if not authorization_header:
                logger.error("Authorization header missing.")
                await self.close()
                return

            try:
                # Extract the token (assumes 'Bearer <token>' format)
                token = authorization_header.decode().split(" ")[1]
                logger.info(f"Extracted token: {token}")

                # Validate the token using sync_to_async to handle synchronous code
                validated_user = await sync_to_async(JwtService.validate_any_token)(
                    token)
                self.scope["user"] = validated_user
                self.user_name = validated_user.email
                await self.accept()
                logger.info(f"User {self.user_name} connected to chat.")

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



