from abc import ABC
from typing import Type

from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework_simplejwt.tokens import BlacklistMixin, Token

from core.enums.jwt import ActionTokenEnum
from core.exceptions.jwt import JwtException

ActionTokenClassType = Type[BlacklistMixin | Token]

UserModel = get_user_model()


class ActionToken(ABC, BlacklistMixin, Token):
    pass


class ActivateToken(ActionToken):
    token_type = ActionTokenEnum.ACTIVATE.token_type
    lifetime = ActionTokenEnum.ACTIVATE.lifetime


class JwtService:
    @staticmethod
    def create_token(user, token_class: ActionTokenClassType):
        return token_class.for_user(user)

    @staticmethod
    def verify_token(token, token_class: ActionTokenClassType):
        try:
            token_res = token_class(token)
            token_res.check_blacklist()
        except Exception:
            raise JwtException

        token_res.blacklist()
        user_id = token_res.payload.get("user_id")
        return get_object_or_404(UserModel, pk=user_id)
