from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import MinistryViewSet, MinistryActivityViewSet, MinistryPageViewSet

router = DefaultRouter()
router.register(r'page', MinistryPageViewSet)
router.register(r'activities', MinistryActivityViewSet)
router.register(r'', MinistryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
