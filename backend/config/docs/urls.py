from django.urls import include, path, re_path

from config.docs.docs import schema_view

swagger_urlpatterns = [
    path(
        "api/",
        include(
            [
                re_path(
                    r"^swagger(?P<format>\.json|\.yaml)$",
                    schema_view.without_ui(cache_timeout=0),
                    name="schema-json",
                ),
                path(
                    "docs/",
                    schema_view.with_ui("swagger", cache_timeout=0),
                    name="schema-swagger-ui",
                ),
                path(
                    "redoc/",
                    schema_view.with_ui("redoc", cache_timeout=0),
                    name="schema-redoc",
                ),
            ]
        ),
    )
]
