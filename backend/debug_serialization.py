import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shalomministry.settings')
sys.path.append('e:/Application/Makamba/makamba-diocese-connect/backend')
django.setup()

from api.settings.models import SiteSettings
from api.settings.serializers import SiteSettingsSerializer

try:
    instance = SiteSettings.get_settings()
    # Mocking a request context
    class MockRequest:
        def build_absolute_uri(self, url):
            return f"http://localhost:8000{url}"
    
    serializer = SiteSettingsSerializer(instance, context={'request': MockRequest()})
    
    print(f"Total fields in Meta: {len(serializer.Meta.fields)}")
    
    # Try one by one via to_representation logic
    from rest_framework import serializers
    
    # Call super().to_representation
    data = super(SiteSettingsSerializer, serializer).to_representation(instance)
    print(f"Fields in digitized data: {len(data)}")
    
    missing_in_data = [f for f in serializer.Meta.fields if f not in data]
    print(f"Missing in digitized data: {missing_in_data}")
    
    # Check if any field raises error on instance
    for field_name in serializer.Meta.fields:
        if field_name not in data:
            try:
                getattr(instance, field_name)
            except Exception as e:
                print(f"Field '{field_name}' MISSING on model!")

except Exception as e:
    import traceback
    traceback.print_exc()
