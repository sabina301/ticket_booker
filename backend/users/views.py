from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Регистрация нового пользователя",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="Пользователь успешно зарегистрирован",
                schema=RegisterSerializer
            ),
            400: "Неверные данные"
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Получение информации о текущем пользователе",
        responses={
            200: openapi.Response(
                description="Информация о пользователе",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'username': openapi.Schema(type=openapi.TYPE_STRING),
                        'email': openapi.Schema(type=openapi.TYPE_STRING),
                        'is_staff': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'is_superuser': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                        'role': openapi.Schema(type=openapi.TYPE_STRING),
                    }
                )
            ),
            401: "Не авторизован"
        }
    )
    def get(self, request):
        user = request.user
        role = getattr(user.profile, 'role', 'user')
        return Response({
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'role': role,
        })
