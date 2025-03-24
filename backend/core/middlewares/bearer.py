from django.utils.deprecation import MiddlewareMixin


class AddBearerPrefixMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Получаем заголовок Authorization
        auth = request.META.get('HTTP_AUTHORIZATION')
        if auth and not auth.lower().startswith('bearer '):
            # Модифицируем заголовок
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {auth}'
