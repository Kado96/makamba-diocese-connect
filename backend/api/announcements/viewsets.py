from rest_framework import viewsets, permissions
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True).prefetch_related('gallery')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['language', 'category']

class AdminAnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all().prefetch_related('gallery')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['language', 'category', 'is_active']
