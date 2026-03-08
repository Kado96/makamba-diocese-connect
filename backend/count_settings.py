import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.settings.models import SiteSettings

count = SiteSettings.objects.count()
ids = list(SiteSettings.objects.values_list('id', flat=True))

print("COUNT:", count)
print("IDs:", ids)
