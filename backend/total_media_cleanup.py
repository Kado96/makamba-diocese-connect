import os
import re
import unicodedata
import django
from django.apps import apps
from django.db import models, transaction
from django.conf import settings
from pathlib import Path

# Configurer l'environnement Django (nécessaire pour mettre à jour la DB)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
os.environ['USE_LOCAL_SQLITE'] = 'True'

try:
    django.setup()
except Exception as e:
    print(f"Erreur d'initialisation Django : {e}")
    exit(1)

def normalize_name(s):
    """Nettoie n'importe quelle chaîne vers un format ASCII propre."""
    base, ext = os.path.splitext(s)
    s = base.lower()
    # Supprime les accents
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('ascii')
    # Remplace tout ce qui n'est pas lettre ou chiffre par des tirets
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s + ext.lower()

def total_media_cleanup():
    print("\n" + "="*60)
    print("--- NETTOYAGE COMPLET DU DOSSIER MEDIA (DISK-FIRST) ---")
    print("="*60 + "\n")

    backend_root = Path(os.getcwd()).resolve()
    media_root = backend_root / "media"
    
    if not media_root.exists():
        print(f"ERREUR : Le dossier media n'a pas ete trouve a {media_root}")
        return

    # 1. SCAN DE TOUS LES FICHIERS PHYSIQUES
    print(f"Analyse de tous les fichiers dans : {media_root}...")
    
    # On commence par les fichiers les plus profonds pour ne pas casser les chemins des dossiers
    all_files = []
    for root, dirs, files in os.walk(media_root, topdown=False):
        for name in files:
            all_files.append(Path(root) / name)

    print(f"Trouve {len(all_files)} fichiers physiques.\n")

    success_count = 0
    db_update_count = 0

    # 2. RENOMMAGE ET MISE À JOUR DB
    with transaction.atomic():
        for old_abs in all_files:
            old_name = old_abs.name
            new_name = normalize_name(old_name)
            
            if old_name != new_name:
                # Construire le nouveau chemin absolu
                new_abs = old_abs.parent / new_name
                
                # Gérer les collisions
                final_new_abs = new_abs
                if final_new_abs.exists() and final_new_abs != old_abs:
                    counter = 1
                    while final_new_abs.exists():
                        base_n, ext_n = os.path.splitext(new_name)
                        final_new_abs = old_abs.parent / f"{base_n}_{counter}{ext_n}"
                        counter += 1
                
                final_new_name = final_new_abs.name
                
                # Calculer les chemins relatifs pour la base de données
                # old_rel est le chemin tel que Django le connaît (ex: diocese/photo.png)
                old_rel = old_abs.relative_to(media_root).as_posix()
                final_new_rel = final_new_abs.relative_to(media_root).as_posix()
                
                try:
                    # RENOMMAGE PHYSIQUE
                    os.rename(str(old_abs), str(final_new_abs))
                    print(f"[RENAME] {old_rel}  ->  {final_new_rel}")
                    success_count += 1
                    
                    # MISE À JOUR DE LA DB (On cherche chaque champ de chaque modèle)
                    for model in apps.get_models():
                        f_fields = [f for f in model._meta.fields if isinstance(f, models.FileField)]
                        for field in f_fields:
                            # On met à jour toutes les variantes possibles de slashs dans la DB
                            updates = model.objects.filter(**{field.name: old_rel}).update(**{field.name: final_new_rel})
                            db_update_count += updates
                            # On gère aussi l'ancien séparateur Windows au cas où
                            model.objects.filter(**{field.name: old_rel.replace('/', '\\')}).update(**{field.name: final_new_rel})
                            
                except Exception as e:
                    print(f"ERREUR sur {old_name} : {e}")

    print("\n" + "="*60)
    print("NETTOYAGE DISQUE TERMINE")
    print(f"Fichiers renonmes : {success_count}")
    print(f"Entrees DB mises a jour : {db_update_count}")
    print("="*60 + "\n")
    print("CONSEIL : Votre dossier 'media' est maintenant 100% propre pour Supabase.")

if __name__ == "__main__":
    total_media_cleanup()
