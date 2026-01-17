from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Warehouse, Location
from .serializers import WarehouseSerializer, LocationSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated]

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]