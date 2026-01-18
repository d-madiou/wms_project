from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StockItem, StockMovement
from .serializers import StockItemSerializer, StockMovementSerializer
from rest_framework.decorators import action
from users.permissions import IsOperatorOrHigher

class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """
        Custom logic: If stock exists for (product, location), add to quantity.
        Otherwise, create new.
        """
        product_id = request.data.get('product')
        location_id = request.data.get('location')
        quantity = int(request.data.get('quantity', 0))

        # --- LOGIC START ---
        existing_stock = StockItem.objects.filter(product_id=product_id, location_id=location_id).first()

        if existing_stock:
            existing_stock.quantity += quantity
            existing_stock.save()
            response_data = self.get_serializer(existing_stock).data
        else:
            # Standard Create
            response = super().create(request, *args, **kwargs)
            response_data = response.data
        
        # === 📝 AUDIT LOG (NEW) ===
        StockMovement.objects.create(
            product_id=product_id,
            location_id=location_id,
            quantity=quantity,
            movement_type='IN',
            user=request.user
        )
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['post'])
    def ship(self, request):
        """
        Custom Endpoint: /api/stock/ship/
        Reduces quantity. Fails if not enough stock.
        """
        product_id = request.data.get('product')
        location_id = request.data.get('location')
        quantity = int(request.data.get('quantity', 0))

        stock_item = StockItem.objects.filter(product_id=product_id, location_id=location_id).first()

        if not stock_item:
            return Response({"error": "Stock not found"}, status=404)
        if stock_item.quantity < quantity:
            return Response({"error": "Not enough stock"}, status=400)

        stock_item.quantity -= quantity
        stock_item.save()

        # === 📝 AUDIT LOG (NEW) ===
        StockMovement.objects.create(
            product_id=product_id,
            location_id=location_id,
            quantity=quantity,
            movement_type='OUT',
            user=request.user
        )

        return Response({"status": "shipped"}, status=200)
    
class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only view for history. No deleting history allowed!
    """
    queryset = StockMovement.objects.all().order_by('-created_at')
    serializer_class = StockMovementSerializer
    
    def get_permissions(self):
        # READ: Everyone (including Drivers)
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        # WRITE: Only Operators and up (No Drivers)
        else:
            permission_classes = [IsOperatorOrHigher]
        return [permission() for permission in permission_classes]