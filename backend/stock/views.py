from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import StockItem, StockMovement
from .serializers import StockItemSerializer, StockMovementSerializer

# 1. StockItemViewSet: Keeps track of "State" (How many items in a bin?)
# We keep this simple. No complex logic here.
class StockItemViewSet(viewsets.ModelViewSet):
    queryset = StockItem.objects.all()
    serializer_class = StockItemSerializer
    permission_classes = [permissions.IsAuthenticated]

# 2. StockMovementViewSet: Keeps track of "Events" (In/Out)
# This is where the frontend sends requests.
class StockMovementViewSet(viewsets.ModelViewSet): # <--- Changed from ReadOnlyModelViewSet to ModelViewSet
    queryset = StockMovement.objects.all().order_by('-created_at')
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            # --- 1. Extract Data ---
            product_id = request.data.get('product')
            location_id = request.data.get('location')
            quantity = request.data.get('quantity')
            movement_type = request.data.get('movement_type')
            
            # --- 2. Validation ---
            if not all([product_id, location_id, quantity, movement_type]):
                return Response(
                    {"detail": "Missing required fields."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --- 3. Ensure the Stock Bin Exists ---
            # Even though we are creating a Movement, we need to ensure the Bin exists 
            # so the Signal (signals.py) can find it and do the math later.
            if movement_type == 'IN':
                StockItem.objects.get_or_create(
                    product_id=product_id, 
                    location_id=location_id,
                    defaults={'quantity': 0}
                )
            
            # --- 4. Prepare Data for Serializer ---
            # We explicitly map the IDs so the serializer validates correctly.
            data = {
                'product': product_id,
                'location': location_id,
                'movement_type': movement_type,
                'quantity': quantity,
                'notes': request.data.get('notes', ''),
                'user': request.user.id
            }

            # --- 5. Save ---
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)