from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile

# Create your tests here.

class ProfileModelTest(TestCase):
    def setUp(self):
        """Создаем тестового пользователя перед каждым тестом"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_profile_creation(self):
        """Тест создания профиля при создании пользователя"""
        self.assertTrue(hasattr(self.user, 'profile'))
        self.assertIsInstance(self.user.profile, Profile)

    def test_profile_default_role(self):
        """Тест значения роли по умолчанию"""
        self.assertEqual(self.user.profile.role, 'user')

    def test_profile_str_method(self):
        """Тест строкового представления профиля"""
        expected_str = f"{self.user.username} (user)"
        self.assertEqual(str(self.user.profile), expected_str)

    def test_profile_role_choices(self):
        """Тест доступных ролей"""
        self.user.profile.role = 'admin'
        self.user.profile.save()
        self.assertEqual(self.user.profile.role, 'admin')

    def test_profile_user_relation(self):
        """Тест связи профиля с пользователем"""
        self.assertEqual(self.user.profile.user, self.user)
        self.assertEqual(self.user, self.user.profile.user)
