import os
import re
import unicodedata
import django
from django.apps import apps
from django.db import models, transaction
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

def normalize_name(s):
    """Transforme 'Groupe_dhommes_et_de_garçons.png' en 'groupe-dhommes-et-de-garcons'"""
    base, _ = os.path.splitext(s)
    s = base.lower()
    # Supprimer les accents
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('ascii')
    # Tout ce qui n'est pas lettre ou chiffre devient un tiret
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

def omni_migration():
    print("\n" + "="*60)
    print("--- MIGRATION OMNI-CANALE (DISQUE + DB + CODE) ---")
    print("="*60 + "\n")

    # ON FORCE LE CHEMIN REEL POUR EVITER TOUTE AMBIGUITE
    backend_root = Path(os.getcwd()).resolve()
    media_root = backend_root / "media"
    project_root = backend_root.parent.resolve()
    
    if not media_root.exists():
        print(f"ERREUR : Le dossier media n'a pas ete trouve a {media_root}")
        return

    # 1. SCAN DU DISQUE
    print(f"Listing des fichiers sur le disque dans : {media_root}")
    actual_files = {} # { 'normalized_key': 'rel_path_on_disk' }
    for root, dirs, files in os.walk(media_root):
        for name in files:
            p = Path(root) / name
            try:
                rel = p.relative_to(media_root).as_posix()
                # La clé est directory/normalized_name
                directory = Path(rel).parent.as_posix()
                if directory == '.': directory = '' # Racine du dossier media
                
                key = (Path(directory) / normalize_name(name)).as_posix()
                if key.startswith('./'): key = key[2:]
                
                actual_files[key] = rel
            except Exception as e:
                continue

    # 2. PLANIFICATION DE LA MIGRATION
    replacements = {} # { 'ancien_nom_complet': 'nouveau_nom_complet' }
    db_updates = [] # [ (instance, field, old_val, actual_disk, new_rel) ]

    print("Analyse de la base de données...")
    for model in apps.get_models():
        file_fields = [f for f in model._meta.fields if isinstance(f, models.FileField)]
        if not file_fields: continue
            
        for instance in model.objects.all():
            for field in file_fields:
                val = getattr(instance, field.name)
                if not val or not val.name: continue
                
                old_rel = val.name.replace('\\', '/')
                clean_db_path = old_rel
                if clean_db_path.startswith('media/'):
                    clean_db_path = clean_db_path[6:]
                
                dir_name, filename = os.path.split(clean_db_path)
                ext = os.path.splitext(filename)[1].lower()
                
                norm_key = (Path(dir_name) / normalize_name(filename)).as_posix()
                if norm_key.startswith('./'): norm_key = norm_key[2:]
                
                if norm_key in actual_files:
                    actual_disk_path = actual_files[norm_key]
                    new_filename = normalize_name(filename) + ext
                    new_rel = (Path(dir_name) / new_filename).as_posix()
                    if new_rel.startswith('./'): new_rel = new_rel[2:]
                    
                    if old_rel != new_rel or actual_disk_path != new_rel:
                        replacements[filename] = new_filename
                        db_updates.append((instance, field.name, old_rel, actual_disk_path, new_rel))

    if not db_updates:
        print("Aucun changement nécessaire (ou fichiers déjà migrés).")
        return

    print(f"Trouvé {len(db_updates)} enregistrements à migrer.")

    # 3. EXÉCUTION DISQUE + DB
    migrated_files = set()
    with transaction.atomic():
        for inst, field, old_db, actual_disk, new_rel in db_updates:
            old_abs = media_root / actual_disk
            new_abs = media_root / new_rel
            
            if actual_disk not in migrated_files:
                if old_abs != new_abs and old_abs.exists():
                    new_abs.parent.mkdir(parents=True, exist_ok=True)
                    
                    final_new_abs = new_abs
                    if final_new_abs.exists() and final_new_abs != old_abs:
                        counter = 1
                        while final_new_abs.exists():
                            final_new_abs = media_root / new_rel.replace('.', f'_{counter}.')
                            counter += 1
                    
                    os.rename(str(old_abs), str(final_new_abs))
                    final_new_rel = final_new_abs.relative_to(media_root).as_posix()
                    print(f"[DISK] {actual_disk} -> {final_new_rel}")
                    migrated_files.add(actual_disk)
                else:
                    final_new_rel = new_rel

            # Mise à jour DB
            inst.__class__.objects.filter(**{field: old_db}).update(**{field: final_new_rel})
            inst.__class__.objects.filter(**{field: old_db.replace('/', '\\')}).update(**{field: final_new_rel})

    # 4. RECHERCHE ET REMPLACEMENT DANS LE CODE
    print("\n--- RECHERCHE DANS LE CODE SOURCE ---")
    valid_replacements = {k: v for k, v in replacements.items() if len(k) > 5}
    
    extensions_to_scan = ['.tsx', '.ts', '.js', '.jsx', '.py', '.css', '.html']
    
    for root, dirs, files in os.walk(project_root):
        if any(x in root for x in ['venv', '.git', 'node_modules', 'staticfiles', 'media']):
            continue
            
        for name in files:
            if any(name.endswith(ext) for ext in extensions_to_scan):
                file_path = Path(root) / name
                if file_path.name in ['omni_migration.py', 'debug_media.py', 'check_db_paths.py']:
                    continue
                    
                try:
                    content = file_path.read_text(encoding='utf-8')
                    new_content = content
                    changed = False
                    
                    for old_name, new_name in valid_replacements.items():
                        if old_name in new_content:
                            new_content = new_content.replace(old_name, new_name)
                            changed = True
                            print(f"[CODE] Remplacement de '{old_name}' dans {file_path.name}")
                    
                    if changed:
                        file_path.write_text(new_content, encoding='utf-8')
                except:
                    continue

    print("\nMIGRATION TERMINEE AVEC SUCCES")

if __name__ == "__main__":
    omni_migration()
