import os
import django
from django.conf import settings
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
os.environ['USE_LOCAL_SQLITE'] = 'True'
django.setup()

def diag():
    print("--- DIAGNOSTIC DES CHEMINS ---")
    print(f"USE_S3_STORAGE: {settings.USE_S3_STORAGE}")
    print(f"MEDIA_URL: {settings.MEDIA_URL}")
    print(f"AWS_STORAGE_BUCKET_NAME: {getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'N/A')}")
    
    from api.announcements.models import Announcement
    from api.settings.models import SiteSettings
    
    print("\n[SITE SETTINGS]")
    s = SiteSettings.objects.first()
    if s:
        print(f"Logo Path in DB: {s.logo.name if s.logo else 'None'}")
        print(f"Logo URL: {s.logo.url if s.logo else 'None'}")
        print(f"Hero Image Path in DB: {s.hero_image.name if s.hero_image else 'None'}")
        print(f"Hero Image URL: {s.hero_image.url if s.hero_image else 'None'}")

    print("\n[ANNOUNCEMENTS (Last 3)]")
    for a in Announcement.objects.order_by('-id')[:3]:
        print(f"ID: {a.id}, Title: {a.title}")
        print(f"  Image Path in DB: {a.image.name if a.image else 'None'}")
        print(f"  Image URL: {a.image.url if a.image else 'None'}")

if __name__ == '__main__':
    diag()
