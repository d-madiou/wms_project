from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import StockMovement, StockItem

@receiver(post_save, sender=StockMovement)
def update_stock_quantity(sender, instance, created, **kwargs):
    if created:
        stock_item, item_created = StockItem.objects.get_or_create(
            product=instance.product,
            location=instance.location,
            defaults={'quantity': 0}
        )
        
        
        if instance.movement_type == 'IN':
            stock_item.quantity += instance.quantity
        elif instance.movement_type == 'OUT':
            stock_item.quantity -= instance.quantity
        
        stock_item.save()