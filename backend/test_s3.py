import os
import django
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
os.environ['USE_LOCAL_SQLITE'] = 'True' # On reste en local pour le test
django.setup()

def test_s3_connection():
    try:
        # Tentative d'écriture d'un petit fichier test
        file_path = 'test_connection.txt'
        content = b'Supabase S3 Test'
        
        print(f"Tentative d'écriture de {file_path} sur S3...")
        path = default_storage.save(file_path, ContentFile(content))
        url = default_storage.url(path)
        
        print(f"\n✅ REUSSITE : Fichier sauvegardé !")
        print(f"Lien généré : {url}")
        
        # Tentative de lecture (si possible)
        if default_storage.exists(path):
            print("✅ Lecture confirmée.")
            # Optionnel: supprimer le fichier test
            # default_storage.delete(path)
        else:
            print("❌ Le fichier semble absent après sauvegarde.")
            
    except Exception as e:
        print(f"\n❌ ERREUR S3 : {e}")

if __name__ == "__main__":
    test_s3_connection()
