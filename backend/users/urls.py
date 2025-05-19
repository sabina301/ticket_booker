from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserInfoView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Декорируем JWT-эндпоинты для Swagger
token_obtain_pair = swagger_auto_schema(
    method='post',
    operation_description="Получение JWT токена",
    responses={
        200: openapi.Response(
            description="Токен успешно получен",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                    'refresh': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
        ),
        401: "Неверные учетные данные"
    }
)(TokenObtainPairView.as_view())

token_refresh = swagger_auto_schema(
    method='post',
    operation_description="Обновление JWT токена",
    responses={
        200: openapi.Response(
            description="Токен успешно обновлен",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'access': openapi.Schema(type=openapi.TYPE_STRING),
                }
            )
        ),
        401: "Неверный refresh токен"
    }
)(TokenRefreshView.as_view())

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserInfoView.as_view(), name='user-info'),
    path('token/', token_obtain_pair, name='token_obtain_pair'),
    path('token/refresh/', token_refresh, name='token_refresh'),
] 