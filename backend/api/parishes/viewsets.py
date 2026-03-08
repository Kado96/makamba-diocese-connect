from rest_framework import viewsets, permissions
from .models import Parish
from .serializers import ParishSerializer

class ParishViewSet(viewsets.ModelViewSet):
    queryset = Parish.objects.all()
    serializer_class = ParishSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['language']
