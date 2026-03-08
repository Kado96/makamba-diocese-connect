from django.urls import path, include
from rest_framework import routers
from .viewsets import *

router = routers.DefaultRouter()

router.register("users", UserViewSet)
router.register("accounts", AccountViewSet, basename="accounts")
router.register("manage-users", UserManagementViewSet, basename="manage-users")

urlpatterns = [
    path('', include(router.urls)),
]
