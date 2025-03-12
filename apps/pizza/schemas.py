from ninja import ModelSchema

from apps.pizza.models import PizzaModel


class PizzaSchemaBase(ModelSchema):
    class Config:
        model = PizzaModel
        from_attributes = True
        model_fields = ['id', 'name', 'size', 'price', 'created_at', 'updated_at']


class PizzaSchema(ModelSchema):
    class Config:
        model = PizzaModel
        from_attributes = True
        model_fields = ['name', 'size', 'price']
