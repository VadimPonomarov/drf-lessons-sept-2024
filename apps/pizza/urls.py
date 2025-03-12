from django.urls import path
from .views import PizzaView, PizzaDetailView

urlpatterns = [
    path("", PizzaView.as_view(), name="pizza_list_create"),
    path("<int:pizza_id>", PizzaDetailView.as_view(), name="pizza_detail_update_delete"),
]
