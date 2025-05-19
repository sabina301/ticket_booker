from rest_framework.permissions import BasePermission

class IsRole(BasePermission):
    """
    Проверяет, что у пользователя роль совпадает с требуемой.
    Использование: permission_classes = [IsRole('admin')]
    """
    def __init__(self, role):
        self.role = role

    def has_permission(self, request, view):
        return hasattr(request.user, 'profile') and request.user.profile.role == self.role

# Пример использования:
# permission_classes = [IsRole('admin')] 