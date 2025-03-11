from django.urls import path

from apps.pizza.views import PizzaView

urlpatterns = [
    path("", PizzaView.as_view(), name='pizza')
]
