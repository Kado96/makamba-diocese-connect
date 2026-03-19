import os
import django
from django.db import models, transaction
from django.apps import apps
from django.utils.text import slugify
from django.conf import settings
from pathlib import Path

# Configurer l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
os.environ['USE_LOCAL_SQLITE'] = 'True'

try:
    django.setup()
except Exception as e:
    print(f"Erreur d'initialisation Django : {e}")
    exit(1)

def migrate_media():
    print("\n" + "="*50)
    print("--- MIGRATION DES MEDIAS (RECH. INTELLIGENTE) ---")
    print("="*50 + "\n")

    media_root = Path(settings.MEDIA_ROOT)
    
    # 1. SCAN DU DISQUE POUR CRÉER UNE CARTE DES FICHIERS PRÉSENTS
    print("Scan du disque physique...")
    disk_files = {} # { 'slug_du_nom': 'chemin_reel_sur_disque' }
    for root, dirs, files in os.walk(media_root):
        for name in files:
            abs_path = Path(root) / name
            rel_path = abs_path.relative_to(media_root).as_posix()
            
            # On crée une clé unique "limpide" pour ce fichier
            base, ext = os.path.splitext(name)
            # On slugifie le nom pour le match (on ignore les accents ici)
            key = (Path(rel_path).parent / slugify(base)).as_posix()
            disk_files[key] = rel_path

    # 2. ANALYSE DES MODÈLES DANS LA BASE DE DONNÉES
    print("Analyse des modeles Django...")
    success_count = 0
    error_count = 0
    
    # On collecte tous les objets à modifier
    migration_plan = [] # [ (instance, field_name, old_rel, new_rel, actual_disk_path) ]

    for model in apps.get_models():
        file_fields = [f for f in model._meta.fields if isinstance(f, models.FileField)]
        if not file_fields: continue
            
        for instance in model.objects.all():
            for field in file_fields:
                file_obj = getattr(instance, field.name)
                if not file_obj or not file_obj.name: continue
                
                old_rel_path = file_obj.name.replace('\\', '/')
                directory, filename = os.path.split(old_rel_path)
                base, ext = os.path.splitext(filename)
                
                # Chercher dans notre carte du disque
                slug_base = slugify(base)
                db_key = (Path(directory) / slug_base).as_posix()
                
                if db_key in disk_files:
                    actual_disk_path = disk_files[db_key]
                    new_rel_path = (Path(directory) / (slug_base + ext.lower())).as_posix()
                    
                    if actual_disk_path != new_rel_path or old_rel_path != new_rel_path:
                        migration_plan.append({
                            'instance': instance,
                            'field': field.name,
                            'old_db': old_rel_path,
                            'actual_disk': actual_disk_path,
                            'new_rel': new_rel_path
                        })

    if not migration_plan:
        print("Aucun fichier a migrer.")
        return

    print(f"Trouve {len(migration_plan)} correspondances a traiter.\n")

    # 3. EXÉCUTION
    with transaction.atomic():
        for item in migration_plan:
            old_abs = media_root / item['actual_disk']
            new_abs = media_root / item['new_rel']
            
            try:
                # Renommer sur le disque si différent
                if old_abs != new_abs:
                    new_abs.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Gérer collision
                    if new_abs.exists() and new_abs != old_abs:
                         counter = 1
                         while new_abs.exists():
                             new_abs = media_root / item['new_rel'].replace('.', f'_{counter}.')
                             counter += 1
                    
                    os.rename(str(old_abs), str(new_abs))
                    print(f"[DISK] {item['actual_disk']} -> {new_abs.relative_to(media_root)}")
                
                # Mettre à jour l'instance DB
                final_rel = new_abs.relative_to(media_root).as_posix()
                
                # On utilise update() massif pour mettre à jour tous ceux qui ont ce nom
                item['instance'].__class__.objects.filter(**{item['field']: item['old_db']}).update(**{item['field']: final_rel})
                
                success_count += 1
            except Exception as e:
                print(f"Erreur sur {item['old_db']}: {e}")
                error_count += 1

    print("\n" + "="*50)
    print("MIGRATION TERMINEE")
    print(f"Resultat : {success_count} succes | {error_count} erreurs")
    print("="*50 + "\n")

if __name__ == "__main__":
    migrate_media()
