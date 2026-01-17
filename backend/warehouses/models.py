from django.db import models
from core.models import TimeStampedModel, SoftDeleteModel

class Warehouse(TimeStampedModel, SoftDeleteModel):
    """
    Physical storage facilities here.
    Inherits created_at, updated_at, and is_active/deleted_at logic.
    """
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Location(TimeStampedModel, SoftDeleteModel):
    """
    Let's define it like a specific spots inside a warehouse (for example, Aisle-01-Shelf-B).
    """
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='locations')
    name = models.CharField(max_length=50)
    barcode = models.CharField(max_length=50, unique=True)

    # Zone Types for more clarity on location purpose
    is_receiving_area = models.BooleanField(default=False)
    is_shipping_area = models.BooleanField(default=False)

    class Meta:
        # note to confuse the picker, let's prevent duplicate location names inside the SAME warehouse
        unique_together = [['warehouse', 'name']]

    def __str__(self):
        return f"{self.name} ({self.warehouse.name})"