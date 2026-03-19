from rest_framework import viewsets, permissions, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation
from .serializers import (
    TimelineEventSerializer, 
    MissionAxeSerializer, 
    VisionValueSerializer, 
    TeamMemberSerializer,
    DiocesePresentationSerializer
)

class TimelineEventViewSet(viewsets.ModelViewSet):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = TimelineEvent.objects.all()
        lang = self.request.query_params.get('lang') or self.request.query_params.get('language')
        if lang:
            queryset = queryset.filter(language=lang)
        return queryset

class MissionAxeViewSet(viewsets.ModelViewSet):
    queryset = MissionAxe.objects.all()
    serializer_class = MissionAxeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = MissionAxe.objects.all()
        lang = self.request.query_params.get('lang') or self.request.query_params.get('language')
        if lang:
            queryset = queryset.filter(language=lang)
        return queryset

class VisionValueViewSet(viewsets.ModelViewSet):
    queryset = VisionValue.objects.all()
    serializer_class = VisionValueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = VisionValue.objects.all()
        lang = self.request.query_params.get('lang') or self.request.query_params.get('language')
        if lang:
            queryset = queryset.filter(language=lang)
        return queryset

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = TeamMember.objects.all()
        lang = self.request.query_params.get('lang') or self.request.query_params.get('language')
        if lang:
            queryset = queryset.filter(language=lang)
        return queryset

class DiocesePresentationViewSet(viewsets.GenericViewSet):
    queryset = DiocesePresentation.objects.all()
    serializer_class = DiocesePresentationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return DiocesePresentation.objects.all()

    def get_object(self):
        obj, created = DiocesePresentation.objects.get_or_create(id=1)
        return obj

    @action(detail=False, methods=['get', 'put', 'patch'])
    def current(self, request):
        obj = self.get_object()

        if request.method == 'GET':
            serializer = self.get_serializer(obj)
            return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
        
        elif request.method in ['PUT', 'PATCH']:
            if not request.user.is_authenticated:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
            serializer = self.get_serializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response([serializer.data]) # 🔥 TOUJOURS UNE LISTE
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

