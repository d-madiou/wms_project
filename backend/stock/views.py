from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import StockItem
from .serializers import StockItemSerializer
from rest_framework.decorators import action

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

        existing_stock = StockItem.objects.filter(
            product_id=product_id, 
            location_id=location_id
        ).first()

        if existing_stock:
            existing_stock.quantity += quantity
            existing_stock.save()
            
            serializer = self.get_serializer(existing_stock)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return super().create(request, *args, **kwargs)
        
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
            return Response({"error": "Stock not found in this location"}, status=status.HTTP_404_NOT_FOUND)

        if stock_item.quantity < quantity:
            return Response({"error": "Not enough stock!"}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce stock
        stock_item.quantity -= quantity
        stock_item.save()
        
        return Response({"status": "shipped", "remaining": stock_item.quantity}, status=status.HTTP_200_OK)