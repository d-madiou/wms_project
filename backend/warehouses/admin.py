from django.contrib import admin
from .models import Warehouse, Location

admin.site.register(Warehouse)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'is_active')

admin.site.register(Location)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'warehouse', 'barcode', 'is_receiving_area', 'is_shipping_area')
    list_filter = ('warehouse', 'is_receiving_area')
    search_fields = ('name', 'barcode')