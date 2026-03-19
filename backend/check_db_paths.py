import os
import django
from django.apps import apps
from django.db import models

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
os.environ['USE_LOCAL_SQLITE'] = 'True'
django.setup()

def check_paths():
    print("--- CHEMINS DANS LA DB ---")
    for model in apps.get_models():
        file_fields = [f for f in model._meta.fields if isinstance(f, models.FileField)]
        if not file_fields: continue
        
        objs = model.objects.all()[:5] # Juste les 5 premiers
        if not objs: continue
        
        print(f"\nModele: {model.__name__}")
        for obj in objs:
            for field in file_fields:
                val = getattr(obj, field.name)
                if val:
                    print(f"  - Champ {field.name}: '{val.name}'")
                    print(f"    CODES: {[ord(c) for c in val.name]}")

if __name__ == "__main__":
    check_paths()
