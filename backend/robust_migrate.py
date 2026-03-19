import os
import sys
import django
from io import StringIO
from django.core.management import call_command

# Configurer le chemin
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')

try:
    django.setup()
    
    with open('migration_result_v3.txt', 'w', encoding='utf-8') as f:
        f.write("--- BACKEND DIAGNOSTIC & FIX ---\n")
        
        # 1. MAKEMIGRATIONS
        f.write("\n1. Running makemigrations ministries:\n")
        out = StringIO()
        try:
            call_command('makemigrations', 'ministries', stdout=out, stderr=out)
            f.write(out.getvalue())
        except Exception as e:
            f.write(f"ERROR: {str(e)}")

        # 2. MIGRATE
        f.write("\n2. Running migrate:\n")
        out = StringIO()
        try:
            call_command('migrate', stdout=out, stderr=out)
            f.write(out.getvalue())
        except Exception as e:
            f.write(f"ERROR: {str(e)}")

        # 3. CHECK PERMISSIONS / MODELS
        f.write("\n3. Testing Models:\n")
        try:
            from api.settings.models import SiteSettings
            from api.ministries.models import Ministry
            f.write(f"SiteSettings fields: {list([f.name for f in SiteSettings._meta.fields if '_fr' in f.name])[:5]}...\n")
            f.write(f"Ministry count: {Ministry.objects.count()}\n")
        except Exception as e:
            f.write(f"ERROR: {str(e)}")

    print("Success. Check migration_result_v3.txt")

except Exception as e:
    with open('migration_result_v3.txt', 'w', encoding='utf-8') as f:
        f.write(f"CRITICAL SETUP ERROR: {str(e)}")
    print(f"Critical error: {e}")
