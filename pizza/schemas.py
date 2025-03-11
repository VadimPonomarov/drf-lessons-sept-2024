from djantic import ModelSchema

from pizza.models import PizzaModel


class PizzaSchemaBase( ModelSchema):
    class Config:
        model=PizzaModel
        model_fields = ["name", "size", "price"]


class PizzaSchema(ModelSchema, ):
    class Config:
        model = PizzaModel
        model_fields = ["id", "name", "size", "price", "created_at", "updated_at"]

