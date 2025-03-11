from datetime import datetime
from core.enums.pizza import PizzaSize
from core.schemas.base import BaseSchema

class PizzaSchemaBase(BaseSchema):
    id: int
    name: str
    size: PizzaSize
    price: float
    created_at: datetime
    updated_at: datetime

class PizzaSchema(PizzaSchemaBase):
    @classmethod
    def define_fields(cls):
        cls.update_fields(
            include={"id", "name", "size", "price", "created_at", "updated_at"},
        )
