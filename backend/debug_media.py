import os
from pathlib import Path

media_path = Path("e:/Application/Makamba/makamba-diocese-connect/backend/media")

print("--- LISTE DES FICHIERS REELS SUR LE DISQUE ---")
for root, dirs, files in os.walk(media_path):
    for name in files:
        rel_path = os.path.relpath(os.path.join(root, name), media_path)
        print(f"FICHIER DISQUE : {rel_path}")
        # Afficher les codes des caractères pour voir l'encodage
        print(f"CODES : {[ord(c) for c in name]}")
