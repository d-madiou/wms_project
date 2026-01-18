from rest_framework import serializers
from .models import StockItem, StockMovement
from inventory.serializers import ProductSerializer
from warehouses.serializers import LocationSerializer

class StockItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = StockItem
        fields = ['id', 'product', 'product_details', 'location', 'location_details', 'quantity', 'updated_at']

class StockMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = StockMovement
        fields = '__all__'