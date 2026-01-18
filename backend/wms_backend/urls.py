from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import RegisterView, UserProfileView
from warehouses.views import WarehouseViewSet, LocationViewSet
from inventory.views import CategoryViewSet, ProductViewSet
from stock.views import StockItemViewSet, StockMovementViewSet

router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet, basename='warehouse')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'stock', StockItemViewSet, basename='stock')
router.register(r'movements', StockMovementViewSet, basename='stockmovement')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'),

    path('api/', include(router.urls)),
]