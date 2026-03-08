import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from api.settings.viewsets import SiteSettingsViewSet

factory = APIRequestFactory()
request = factory.patch('/api/settings/1/', {'hero_title_rn': 'Test'}, format='json')
user = type('User', (), {'is_staff': True, 'is_superuser': True, 'is_authenticated': True, 'is_active': True})()
force_authenticate(request, user=user)

view = SiteSettingsViewSet.as_view({'patch': 'partial_update'})
try:
    response = view(request, pk=1)
    print("STATUS", response.status_code)
    print("DATA", response.data)
except Exception as e:
    import traceback
    traceback.print_exc()
