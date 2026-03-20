
import os
import django
from django.db import models
from django.utils.text import slugify
from django.conf import settings

# Configuration de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

def _clean_filename(name):
    """
    Fonction universelle de nettoyage de noms de fichiers.
    """
    if not name:
        return name
        
    directory, filename = os.path.split(name)
    base, ext = os.path.splitext(filename)
    
    # Nettoie le nom de base
    clean_base = slugify(base)
    
    if not clean_base:
        return name
        
    return os.path.join(directory, f"{clean_base}{ext.lower()}").replace('\\', '/')

def clean_all_models():
    """Parcourt tous les modèles et nettoie les noms de fichiers en base locale + disque."""
    from django.apps import apps
    
    # Liste des apps à traiter
    target_apps = ['accounts', 'announcements', 'ministries', 'pages', 'parishes', 'sermons', 'settings', 'testimonials']
    
    print("[START] Debut du nettoyage des noms de medias (Base + Disque)...")
    
    total_cleaned = 0
    media_root = settings.MEDIA_ROOT
    
    for app_label in target_apps:
        try:
            app_config = apps.get_app_config(app_label)
        except LookupError:
            continue
            
        for model in app_config.get_models():
            # Trouver les champs FileField/ImageField
            file_fields = [f for f in model._meta.fields if isinstance(f, (models.FileField, models.ImageField))]
            
            if not file_fields:
                continue
                
            items = model.objects.using('default').all()
            for item in items:
                updated = False
                for field in file_fields:
                    current_field = getattr(item, field.name)
                    if not current_field or not current_field.name:
                        continue
                        
                    current_name = current_field.name
                    clean_name = _clean_filename(current_name)
                    
                    if current_name != clean_name:
                        print(f"  [FIX] {model.__name__} (ID:{item.id}) - {field.name}:")
                        print(f"    '{current_name}' -> '{clean_name}'")
                        
                        # RENOMMAGE PHYSIQUE SUR LE DISQUE
                        old_path = os.path.join(media_root, current_name)
                        new_path = os.path.join(media_root, clean_name)
                        
                        if os.path.exists(old_path):
                            os.makedirs(os.path.dirname(new_path), exist_ok=True)
                            try:
                                # Si le fichier de destination existe déjà, on le supprime ou on ignore
                                if os.path.exists(new_path) and old_path.lower() != new_path.lower():
                                    if os.path.getsize(old_path) == os.path.getsize(new_path):
                                        os.remove(old_path)
                                        print(f"    [DELETE] Doublon identique supprime.")
                                    else:
                                        # Conserver les deux ? Non, on slugifie par dessus.
                                        os.remove(new_path)
                                        os.rename(old_path, new_path)
                                        print(f"    [OVERWRITE] Fichier ecrase par la version plus recente.")
                                else:
                                    os.rename(old_path, new_path)
                                    print(f"    [RENAME] Fichier renomme sur disque.")
                            except Exception as e:
                                print(f"    [ERROR] Erreur disque: {e}")
                        
                        # On met à jour en DB (objet en mémoire)
                        setattr(item, field.name, clean_name)
                        updated = True
                
                if updated:
                    # On utilise update() pour changer uniquement les noms en DB
                    update_data = {}
                    for f in file_fields:
                        val = getattr(item, f.name)
                        if val:
                            update_data[f.name] = val.name
                    
                    model.objects.using('default').filter(id=item.id).update(**update_data)
                    total_cleaned += 1
    
    print(f"\n[DONE] Nettoyage termine. {total_cleaned} entrees mises a jour.")

if __name__ == "__main__":
    clean_all_models()
