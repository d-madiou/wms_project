from django.db import models
from core.models import TimeStampedModel, SoftDeleteModel
from inventory.models import Product
from warehouses.models import Location

class StockItem(TimeStampedModel, SoftDeleteModel):
    """
    When we trace the link between 'What' (Product) and 'Where' (Location).
    Our Answer: "How much of X do we have in Y?"
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='stock')
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        # Let's prevent duplicate rows for the same product in the same bin
        unique_together = [['product', 'location']]

    def __str__(self):
        return f"{self.product.sku} in {self.location.name} ({self.quantity})"