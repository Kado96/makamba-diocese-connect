from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import SermonCategoryViewSet, SermonViewSet, AdminSermonViewSet

router = DefaultRouter()
router.register(r"categories", SermonCategoryViewSet, basename="sermon-category")
router.register(r"admin", AdminSermonViewSet, basename="admin-sermon")
router.register(r"", SermonViewSet, basename="sermon")

urlpatterns = [
    path("", include(router.urls)),
]


