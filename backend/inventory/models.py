from django.db import models
from core.models import TimeStampedModel, SoftDeleteModel

class Category(TimeStampedModel, SoftDeleteModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(TimeStampedModel, SoftDeleteModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    
    
    sku = models.CharField(max_length=50, unique=True, help_text="Internal Stock Keeping Unit")
    barcode = models.CharField(max_length=100, unique=True, help_text="Scannable Barcode (UPC/EAN)")
    
   
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Weight in kg")

    def __str__(self):
        return f"[{self.sku}] {self.name}"