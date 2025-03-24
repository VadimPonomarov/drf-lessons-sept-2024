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
    }
}
