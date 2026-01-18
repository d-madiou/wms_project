from django.shortcuts import render
from rest_framework import viewsets
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrManager

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from stock.models import StockItem, StockMovement

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permissions_classes = [IsAuthenticated]
        else:
            permissions_classes = [IsAdminOrManager]
        return [permission() for permission in permissions_classes]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminOrManager]
        return [permission() for permission in permission_classes]
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    Returns high-level stats for the Dashboard.
    """
    # 1. Total Products defined in system
    total_products = Product.objects.count()

    # 2. Total Items physically in stock (Sum of all quantities)
    # We loop through stock items and sum the quantity
    all_stock = StockItem.objects.all()
    total_stock_quantity = sum([item.quantity for item in all_stock])

    # 3. Low Stock Items (e.g., less than 10 units)
    low_stock_count = StockItem.objects.filter(quantity__lt=10).count()

    # 4. Recent Movements (Last 5 transactions)
    recent_movements = StockMovement.objects.all().order_by('-created_at')[:5]
    
    # We need to manually format the movements since we aren't using a serializer here
    recent_activity = []
    for move in recent_movements:
        recent_activity.append({
            "action": f"{move.movement_type} - {move.product.name}",
            "quantity": move.quantity,
            "time": move.created_at.strftime("%Y-%m-%d %H:%M"),
            "user": move.user.username
        })

    return Response({
        "total_products": total_products,
        "total_stock_quantity": total_stock_quantity,
        "low_stock_count": low_stock_count,
        "recent_activity": recent_activity
    })