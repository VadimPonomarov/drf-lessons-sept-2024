from enum import Enum

from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from core.exceptions.jwt import JwtException


class ErrorType(Enum):
    BAD_REQUEST = {
        "exceptions": [KeyError, ValueError],
        "code": "bad_request",
        "message": "Некорректный запрос.",
        "status": status.HTTP_400_BAD_REQUEST,
    }
    PERMISSION_DENIED = {
        "exceptions": [PermissionDenied],
        "code": "permission_denied",
        "message": "Недостаточно прав.",
        "status": status.HTTP_403_FORBIDDEN,
    }
    JWT_ERROR = {
        "exceptions": [JwtException],
        "code": "jwt_error",
        "message": "Ошибка аутентификации JWT.",
        "status": status.HTTP_401_UNAUTHORIZED,
    }
    NOT_FOUND = {
        "exceptions": [FileNotFoundError],
        "code": "not_found",
        "message": "Ресурс не найден.",
        "status": status.HTTP_404_NOT_FOUND,
    }
    SERVER_ERROR = {
        "exceptions": None,  # Этот тип используется для случаев, не указанных явно
        "code": "server_error",
        "message": "Произошла ошибка на сервере.",
        "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
    }

    def __init__(self, data):
        self.exceptions = data["exceptions"]
        self.code = data["code"]
        self.message = data["message"]
        self.http_status = data["status"]
        # Автоматически создаём обработчик, который использует self.message для error_message
        self.handler = self._build_handler()

    def _build_handler(self):
        """Возвращает функцию-обработчик, использующую атрибуты объекта для формирования ответа."""
        return lambda exc: Response({
            "error_code": self.code,
            "error_message": self.message,  # Используем значение message
            "details": str(exc)
        }, status=self.http_status)

    @staticmethod
    def get_by_exception(exc):
        """
        Перебирает элементы ErrorType и, если выброшенное исключение является экземпляром одного из типов,
        указанных в поле "exceptions", возвращает соответствующий элемент.
        Если исключение не соответствует ни одному типу – возвращает SERVER_ERROR.
        """
        for error_type in ErrorType:
            if error_type.exceptions and any(
                    isinstance(exc, exc_type) for exc_type in error_type.exceptions):
                return error_type
        return ErrorType.SERVER_ERROR

    def handle_exception(self, exc):
        """Вызывает обработчик для формирования HTTP-ответа."""
        return self.handler(exc)
