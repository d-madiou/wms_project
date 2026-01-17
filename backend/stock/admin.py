from django.contrib import admin
from .models import StockItem

@admin.register(StockItem)
class StockItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'location', 'quantity', 'updated_at')
    list_filter = ('location__warehouse', 'product__category')
    search_fields = ('product__sku', 'product__name', 'location__barcode')