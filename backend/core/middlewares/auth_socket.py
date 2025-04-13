from asgiref.sync import sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from config.extra_config.logger_config import logger
from core.services.jwt import JwtService

User = get_user_model()


class JWTAuthMiddleware(BaseMiddleware):
    """
    Middleware для проверки JWT токена в WebSocket соединениях.
    """

    async def __call__(self, scope, receive, send):
        # Извлечение заголовков из scope
        headers = dict(scope.get("headers", {}))
        authorization_header = headers.get(b'authorization', None)

        if authorization_header:
            try:
                token = authorization_header.decode().split(" ")[1]
                validated_user = await sync_to_async(JwtService.validate_any_token)(
                    token)
                user_from_db = await sync_to_async(get_object_or_404)(User,
                                                                      pk=validated_user.id)
                user_name = await sync_to_async(
                    lambda: user_from_db.profile.name if user_from_db.profile.name
                    else validated_user.email.split("@")[0]
                )()

                # Добавляем данные пользователя в scope
                scope["user"] = validated_user
                scope["user_name"] = user_name

                logger.info(f"User authenticated: {user_name}")

            except Exception as e:
                logger.error(f"Error in JWT authentication: {e}")
                scope["user"] = None
                scope["user_name"] = None
        else:
            logger.error("Authorization header missing.")
            scope["user"] = None
            scope["user_name"] = None

        return await super().__call__(scope, receive, send)
