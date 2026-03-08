import os, django, json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from rest_framework.test import APIRequestFactory, force_authenticate
from api.settings.viewsets import SiteSettingsViewSet, SiteSettingsCurrentView
from api.settings.models import SiteSettings

print("=" * 60)
print("DIAGNOSTIC FINAL - Admin Site")
print("=" * 60)

factory = APIRequestFactory()
admin = type('User', (), {'is_staff': True, 'is_superuser': True, 'is_authenticated': True, 'is_active': True})()

# 1. GET /api/settings/current/ - tous les champs doivent etre la
print("\n--- 1. GET /api/settings/current/ ---")
req = factory.get('/api/settings/current/')
req.user = admin
resp = SiteSettingsCurrentView.as_view()(req)
data = resp.data
print(f"  Status: {resp.status_code}")
print(f"  Total keys: {len(data)}")

# Verify ALL model fields are exposed
s = SiteSettings.objects.get(pk=1)
model_fields = [f.name for f in SiteSettings._meta.get_fields() if hasattr(f, 'column')]
missing_model = [f for f in model_fields if f not in data and f != 'id']
if missing_model:
    print(f"  ⚠ Model fields NOT in API ({len(missing_model)}): {missing_model[:20]}")
else:
    print("  ✅ All model fields exposed in API")

# 2. PATCH test - modify and verify
print("\n--- 2. PATCH /api/settings/1/ ---")
test_data = {
    'hero_title_rn': 'Diyoseze ya Makamba',
    'stories_badge_fr': 'Sur le terrain',
    'stories_title_fr': "Toute l'actualité de nos actions",
}
req = factory.patch('/api/settings/1/', test_data, format='json')
force_authenticate(req, user=admin)
resp = SiteSettingsViewSet.as_view({'patch': 'partial_update'})(req, pk=1)
print(f"  Status: {resp.status_code}")
if resp.status_code == 200:
    for k, v in test_data.items():
        got = resp.data.get(k, 'NOT FOUND')
        ok = "✅" if got == v else "❌"
        print(f"  {ok} {k}: '{got}'")
else:
    print(f"  ❌ ERROR: {resp.data}")

# 3. Verify that the admin can read all localized field variants
print("\n--- 3. Admin field coverage ---")
sections = {
    'hero': ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_btn1_text', 'hero_btn1_link', 'hero_btn2_text', 'hero_btn2_link'],
    'vision': ['vision_title', 'vision_description', 'vision_pillar1_title', 'vision_pillar1_desc', 'vision_pillar2_title', 'vision_pillar2_desc', 'vision_pillar3_title', 'vision_pillar3_desc'],
    'engage': ['engage_title', 'engage_description', 'engage_item1_title', 'engage_item1_desc', 'engage_item1_cta', 'engage_item2_title', 'engage_item2_desc', 'engage_item2_cta', 'engage_item3_title', 'engage_item3_desc', 'engage_item3_cta'],
    'parishes': ['parishes_title', 'parishes_description', 'parishes_map_title', 'parishes_map_subtitle', 'parishes_map_stats'],
    'stories': ['stories_badge', 'stories_title'],
    'stats': ['stat_years_label', 'stat_emissions', 'stat_audience', 'stat_languages'],
}
langs = ['fr', 'rn', 'en', 'sw']
for section, bases in sections.items():
    missing = []
    for base in bases:
        for lang in langs:
            key = f"{base}_{lang}"
            if key not in data:
                missing.append(key)
    if missing:
        print(f"  ⚠ {section}: MISSING {missing}")
    else:
        print(f"  ✅ {section}: all {len(bases)*len(langs)} keys present")

print("\n" + "=" * 60)
print("DIAGNOSTIC COMPLETE")
print("=" * 60)
