from rest_framework import permissions

class IsAdminOrManager(permissions.BasePermission):
    """
    Allows access only to Admin or Manager.
    Used for: Master Data (Creating Products, Warehouses).
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'manager']

class IsOperatorOrHigher(permissions.BasePermission):
    """
    Allows Admin, Manager, or Operator.
    Used for: Stock Operations (Receive/Ship).
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['admin', 'manager', 'operator']