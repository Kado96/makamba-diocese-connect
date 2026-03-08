import os
import sys
import django

# Configuration du chemin Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shalomministry.settings')

# Redirection vers un fichier log
log_file = open('fix_log.txt', 'w', encoding='utf-8')
sys.stdout = log_file
sys.stderr = log_file

try:
    django.setup()
    from django.core.management import call_command
    from api.settings.models import SiteSettings
    from api.ministries.models import Ministry
    from api.announcements.models import Announcement

    print("--- Running Migrations ---")
    call_command('makemigrations')
    call_command('migrate')

    print("\n--- Verifying SiteSettings ---")
    settings = SiteSettings.get_settings()
    print(f"Site Settings: {settings.site_name}")
    
    # Correction des champs si nécessaire (au cas où get_settings a créé avec de vieux champs)
    # Mais le modèle a été mis à jour, donc ça devrait être bon.

    print("\n--- Verifying Ministries ---")
    print(f"Ministry count: {Ministry.objects.count()}")

    print("\n--- Verifying Announcements ---")
    print(f"Announcement count: {Announcement.objects.count()}")
    
    print("\nBackend fix script completed successfully.")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
