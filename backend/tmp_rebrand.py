
from api.settings.models import SiteSettings
try:
    s = SiteSettings.objects.get(pk=1)
    s.site_name = "Diocese Makamba"
    s.logo = None
    s.logo_url = ""
    s.hero_badge_fr = "KANISA LA ANGLIKANA BURUNDI"
    s.save()
    print("SUCCESS: Site name updated to Diocese Makamba and logo reset.")
except SiteSettings.DoesNotExist:
    SiteSettings.objects.create(pk=1, site_name="Diocese Makamba", hero_badge_fr="KANISA LA ANGLIKANA BURUNDI")
    print("SUCCESS: Default site settings created with Diocese Makamba.")
except Exception as e:
    print(f"ERROR: {str(e)}")
