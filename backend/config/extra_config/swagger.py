from core.logging.logger_config import logger
def add_bearer_prefix(get_auth_header):
    def wrapper(request):
        auth = get_auth_header(request)
        print(f"Initial auth: {auth}")  # Для отладки
        logger.info(f"Initial auth: {auth}")  # Логирование
        if auth and not auth.lower().startswith('bearer '):
            result = f'Bearer {auth}'
            print(f"Modified auth: {result}")  # Для отладки
            logger.info(f"Modified auth: {result}")  # Логирование
            return result
        return auth
    return wrapper



SWAGGER_SETTINGS = {
    'USE_SESSION_AUTH': True,
    'LOGIN_URL': 'auth_login',
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'Put in Bearer \<token\>.',
        },
    },
    'AUTH_HEADER_HANDLER': add_bearer_prefix(
        lambda request: request.META.get('HTTP_AUTHORIZATION')),
}
