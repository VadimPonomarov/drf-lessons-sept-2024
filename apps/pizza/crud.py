from apps.pizza.models import PizzaModel
from apps.pizza.schemas import PizzaSchemaBase, PizzaSchema
from loguru import logger

class PizzaCRUD:
    def create(self, data: PizzaSchemaBase):
        try:
            pizza = PizzaModel(**data.dict())
            pizza.save()
            return PizzaSchema.from_orm(pizza)
        except Exception as e:
            logger.error(f"Error creating pizza: {e}")
            return None

    def retrieve(self, pizza_id: int = None):
        try:
            if pizza_id:
                pizza = PizzaModel.objects.get(pk=pizza_id)
                return PizzaSchema.from_orm(pizza)
            pizzas = PizzaModel.objects.all()
            return [PizzaSchema.from_orm(pizza) for pizza in pizzas]
        except PizzaModel.DoesNotExist:
            logger.error("PizzaModel not found.")
            return None
        except Exception as e:
            logger.exception("An error occurred while retrieving pizzas.")
            return None

    def update(self, pizza_id: int, data: PizzaSchemaBase):
        try:
            pizza_data = data.dict(exclude_unset=True)
            PizzaModel.objects.filter(pk=pizza_id).update(**pizza_data)
            pizza = PizzaModel.objects.get(pk=pizza_id)
            return PizzaSchema.from_orm(pizza)
        except PizzaModel.DoesNotExist:
            logger.error(f"PizzaModel with id {pizza_id} not found.")
            return None
        except Exception as e:
            logger.exception("An error occurred while updating the pizza.")
            return None

    def delete(self, pizza_id: int):
        try:
            pizza = PizzaModel.objects.get(pk=pizza_id)
            pizza.delete()
            return True
        except PizzaModel.DoesNotExist:
            logger.error(f"PizzaModel with id {pizza_id} not found.")
            return False
        except Exception as e:
            logger.exception("An error occurred while deleting the pizza.")
            return False

