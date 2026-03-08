import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')

import django
django.setup()

from api.settings.models import SiteSettings

try:
    s = SiteSettings.objects.get(pk=1)
    s.site_name = "Diocese Makamba"
    s.logo = None
    s.logo_url = ""
    s.save()
    print(f"OK: site_name = {s.site_name}")
except SiteSettings.DoesNotExist:
    s = SiteSettings.objects.create(pk=1, site_name="Diocese Makamba")
    print(f"CREATED: site_name = {s.site_name}")
except Exception as e:
    print(f"ERROR: {e}")
