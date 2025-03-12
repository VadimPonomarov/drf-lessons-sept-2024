from ninja import ModelSchema

from apps.pizza.models import PizzaModel


class PizzaSchemaBase(ModelSchema):
    class Config:
        model = PizzaModel
        model_fields = ['id', 'name', 'size', 'price', 'created_at', 'updated_at']


class PizzaSchema(PizzaSchemaBase):
    class Config:
        model = PizzaModel
        model_fields = ['name', 'size', 'price']
