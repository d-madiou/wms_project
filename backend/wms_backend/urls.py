from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import ViewSets
from warehouses.views import WarehouseViewSet, LocationViewSet
from inventory.views import CategoryViewSet, ProductViewSet
from stock.views import StockItemViewSet

# Create a Router and register our ViewSets
router = DefaultRouter()
router.register(r'warehouses', WarehouseViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'stock', StockItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Main API URLs (The router handles the rest!)
    path('api/', include(router.urls)),
]