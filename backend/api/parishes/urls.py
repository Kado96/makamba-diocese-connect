from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ParishViewSet

router = DefaultRouter()
router.register(r'', ParishViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
