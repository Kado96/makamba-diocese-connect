
import os
import django
from django.db import models

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

def check_prod_media():
    from api.settings.models import SiteSettings
    try:
        settings = SiteSettings.objects.using('prod').first()
        if settings:
            print(f"Site name in Prod: {settings.site_name}")
            print(f"Logo in Prod: {settings.logo.name if settings.logo else 'None'}")
            print(f"Hero Image in Prod: {settings.hero_image.name if settings.hero_image else 'None'}")
            if settings.logo:
                try:
                    print(f"Logo URL in Prod: {settings.logo.url}")
                except Exception as e:
                    print(f"Error getting Logo URL: {e}")
        else:
            print("No SiteSettings found in Prod.")
    except Exception as e:
        print(f"Error connecting to Prod: {e}")

if __name__ == "__main__":
    check_prod_media()
