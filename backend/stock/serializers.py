from rest_framework import serializers
from .models import StockItem
# We import these to nest details inside the stock response
from inventory.serializers import ProductSerializer
from warehouses.serializers import LocationSerializer

class StockItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    location_details = LocationSerializer(source='location', read_only=True)

    class Meta:
        model = StockItem
        fields = ['id', 'product', 'product_details', 'location', 'location_details', 'quantity', 'updated_at']