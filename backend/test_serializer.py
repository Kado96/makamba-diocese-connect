import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from django.conf import settings
settings.ALLOWED_HOSTS.append('testserver')

from api.pages.models import DiocesePresentation
from api.pages.serializers import DiocesePresentationSerializer
from django.test import RequestFactory

def run_test():
    print("Testing DiocesePresentationSerializer...")
    try:
        obj = DiocesePresentation.objects.first()
        if not obj:
            print("No object found. Creating one...")
            obj = DiocesePresentation.objects.create()
        req = RequestFactory().get('/api/pages/diocese-presentation/current/')
        ser = DiocesePresentationSerializer(obj, context={'request': req})
        data = ser.data
        print(f"Serialized fields: {list(data.keys())}")
        print("SUCCESS")
    except Exception as e:
        import traceback
        traceback.print_exc()

run_test()
