from django.conf import settings
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
        unique_together = [['product', 'location']]

    def __str__(self):
        return f"{self.product.sku} in {self.location.name} ({self.quantity})"
    
class StockMovement(models.Model):
    MOVEMENT_TYPES = (
        ('IN', 'Inbound (Receive)'),
        ('OUT', 'Outbound (Ship)'),
    )

    product = models.ForeignKey('inventory.Product', on_delete=models.CASCADE)
    location = models.ForeignKey('warehouses.Location', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.movement_type} - {self.product.sku} ({self.quantity})"