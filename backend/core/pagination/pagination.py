from django.core.paginator import EmptyPage
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        try:
            prev_page = bool(self.page.previous_page_number())
        except EmptyPage:
            prev_page = False

        try:
            next_page = bool(self.page.next_page_number())
        except EmptyPage:
            next_page = False

        return Response(
            {
                "page": self.page.number,
                "total": self.page.paginator.count,
                "page_size": self.page_size,
                "prev": prev_page,
                "next": next_page,
                "results": data,
            }
        )
