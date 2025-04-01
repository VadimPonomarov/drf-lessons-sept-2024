from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware

from core.enums.jwt import ActionTokenEnum
from core.services.jwt import JwtService


class AuthSocketMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        if scope.get("type") == "websocket":
            query_string = scope.get("query_string", b"").decode("utf-8")
            # Разбираем строку запроса
            token_parsed = parse_qs(query_string).get("token", None)
            if token_parsed:
                scope["user"] = JwtService.verify_token(token_parsed[0],
                                                        ActionTokenEnum.SOCKET)
        return await super().__call__(scope, receive, send)
