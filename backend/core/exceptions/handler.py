from rest_framework.views import exception_handler

from core.enums.exceptions import ErrorType


def custom_exception_handler(exc, context):
    """
    Кастомный обработчик исключений, который:
    – пытается определить тип ошибки через ErrorType.get_by_exception;
    – если найден элемент Enum, возвращает Response через его handler;
    – для остальных случаев использует стандартный exception_handler.
    """
    # Попытка сопоставить выброшенное исключение с элементом ErrorType
    error_type = ErrorType.get_by_exception(exc)
    response = error_type.handle_exception(exc)

    # Дополнительно можно вызвать стандартный handler – если он вернул ответ, можно объединить данные.
    # Если стандартный handler не справился (вернул None) или вы предпочитаете полностью заменять ответ,
    # можно сразу вернуть response.
    std_response = exception_handler(exc, context)
    if std_response is not None:
        # Здесь можно объединять или модифицировать ответ.
        # Например, добавить стандартные детали или логирование.
        return response
    else:
        return response
