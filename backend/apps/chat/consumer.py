from djangochannelsrestframework.generics import GenericAsyncAPIConsumer

from config.extra_config.logger_config import logger


class ChatConsumer(GenericAsyncAPIConsumer):
    user_name = None
    room_name = None

    async def connect(self):
        try:
            if not self.scope["user"] or self.scope["user"].is_anonymous:
                await self.close()
            else:
                await self.accept()
                logger.info("User connected to chat.")
        except Exception as e:
            logger.error(f"Error in connect(): {e}")
