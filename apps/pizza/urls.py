from django.urls import path

from apps.pizza.views import PizzaView, PizzaDetailView

urlpatterns = [
    path("", PizzaView.as_view(), name='pizza'),
    path("/<int:pizza_id>", PizzaDetailView.as_view(),
         name='pizza_detail_update_delete')
]
