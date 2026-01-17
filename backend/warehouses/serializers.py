from rest_framework import serializers
from .models import Warehouse, Location

class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'address', 'is_active', 'created_at']

class LocationSerializer(serializers.ModelSerializer):
    # We want to see the warehouse name, not just ID so let's add a read-only field
    warehouse_name = serializers.ReadOnlyField(source='warehouse.name')

    class Meta:
        model = Location
        fields = ['id', 'warehouse', 'warehouse_name', 'name', 'barcode', 'is_receiving_area', 'is_shipping_area']