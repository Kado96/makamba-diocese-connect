from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import (
    TimelineEventViewSet, 
    MissionAxeViewSet, 
    VisionValueViewSet,
    TeamMemberViewSet,
    DiocesePresentationViewSet
)

router = DefaultRouter()
router.register(r'timeline', TimelineEventViewSet)
router.register(r'axes', MissionAxeViewSet)
router.register(r'values', VisionValueViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'diocese-presentation', DiocesePresentationViewSet, basename='diocese-presentation')

urlpatterns = [
    path('', include(router.urls)),
]
