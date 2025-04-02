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
    token_type: str
    lifetime: int

    def __init_subclass__(cls, **kwargs):
        action_enum = kwargs.pop("action_enum")
        super().__init_subclass__(**kwargs)
        cls.token_type = action_enum.token_type
        cls.lifetime = action_enum.lifetime


class ActivateToken(ActionToken, action_enum=ActionTokenEnum.ACTIVATE):
    pass


class ChangePasswordToken(ActionToken, action_enum=ActionTokenEnum.CHANGE_PASSWORD):
    pass


class SocketToken(ActionToken, action_enum=ActionTokenEnum.SOCKET):
    pass


class JwtService:
    @staticmethod
    def create_token(user, token_class: Type[ActionToken]):
        """
        Creates a token for the given user using the specified token class.
        """
        return token_class.for_user(user)

    @staticmethod
    def verify_token(token, token_class: Type[ActionToken]):
        """
        Verifies the given token using the specified token class.
        Raises JwtException for invalid tokens.
        """
        try:
            # Create a token instance using the token string
            token_instance = token_class(token)

            # Check if the token is blacklisted
            token_instance.check_blacklist()

            # Blacklist the token after usage
            token_instance.blacklist()

            # Extract the user_id from the token payload
            user_id = token_instance.payload.get("user_id")
            if not user_id:
                raise JwtException("Token payload does not contain 'user_id'.")

            # Retrieve the associated user
            return get_object_or_404(UserModel, pk=user_id)

        except Exception as e:
            raise JwtException(f"Token verification failed: {str(e)}")
