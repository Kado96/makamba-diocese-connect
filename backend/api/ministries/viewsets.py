from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ministry, MinistryActivity
from .serializers import MinistrySerializer, MinistryActivitySerializer

class MinistryViewSet(viewsets.ModelViewSet):
    queryset = Ministry.objects.all().prefetch_related('activities')
    serializer_class = MinistrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['language']

    @action(detail=True, methods=['post'])
    def activities(self, request, pk=None):
        ministry = self.get_object()
        serializer = MinistryActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ministry=ministry)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class MinistryActivityViewSet(viewsets.ModelViewSet):
    queryset = MinistryActivity.objects.all()
    serializer_class = MinistryActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    http_method_names = ['delete']
