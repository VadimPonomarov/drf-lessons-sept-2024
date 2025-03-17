from datetime import datetime
from pydantic import BaseModel
from typing import Set, Dict, Any, TypeVar, Generic
from abc import ABC, abstractmethod

T = TypeVar("T", bound="BaseModel")


class BaseSchema(BaseModel, ABC):
    _include_fields: Set[str] | None = None
    _exclude_fields: Set[str] | None = None

    class Config:
        from_attributes = True

    def __init__(self, **data: Any):
        super().__init__(**data)

    def _apply_include_exclude(self, **kwargs):
        kwargs.setdefault("include", self._include_fields)
        kwargs.setdefault("exclude", self._exclude_fields)
        return kwargs

    def dict(self, **kwargs) -> Dict[str, Any]:
        kwargs = self._apply_include_exclude(**kwargs)
        return super().dict(**kwargs)

    def json(self, **kwargs) -> str:
        kwargs = self._apply_include_exclude(**kwargs)
        return super().json(**kwargs)

    @classmethod
    def update_fields(cls, include: Set[str] = None, exclude: Set[str] = None):
        cls._include_fields = include
        cls._exclude_fields = exclude

    @classmethod
    def get_field_names(cls) -> Set[str]:
        fields = set()
        for base in cls.__bases__:
            if hasattr(base, "__annotations__"):
                fields.update(base.__annotations__.keys())
        fields.update(cls.__annotations__.keys())
        return fields

    @classmethod
    def define_fields(cls):
        cls.update_fields(
            include={"id", "name", "size", "price", "created_at", "updated_at"},
            exclude=None,
        )

    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.define_fields()
