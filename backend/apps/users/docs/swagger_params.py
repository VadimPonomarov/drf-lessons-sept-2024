from drf_yasg import openapi

pagination_parameters = [
    openapi.Parameter(
        name='page',
        in_=openapi.IN_QUERY,
        description='Page number for pagination',
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        name='page_size',
        in_=openapi.IN_QUERY,
        description='Number of items per page',
        type=openapi.TYPE_INTEGER
    ),
]

filtering_parameters = [
    openapi.Parameter(
        name='id',
        in_=openapi.IN_QUERY,
        description='Filter by ID (exact, gt, gte, lt, lte, in, range)',
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        name='email',
        in_=openapi.IN_QUERY,
        description='Filter by email (exact, contains)',
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        name='is_active',
        in_=openapi.IN_QUERY,
        description='Filter by active status (exact)',
        type=openapi.TYPE_BOOLEAN
    ),
    openapi.Parameter(
        name='is_staff',
        in_=openapi.IN_QUERY,
        description='Filter by staff status (exact)',
        type=openapi.TYPE_BOOLEAN
    ),
    openapi.Parameter(
        name='is_superuser',
        in_=openapi.IN_QUERY,
        description='Filter by superuser status (exact)',
        type=openapi.TYPE_BOOLEAN
    ),
]

