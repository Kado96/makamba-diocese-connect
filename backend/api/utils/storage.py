import os
from django.utils.text import slugify
from django.core.files.storage import FileSystemStorage
from storages.backends.s3boto3 import S3Boto3Storage

def _clean_filename(name):
    """
    Fonction universelle de nettoyage de noms de fichiers.
    """
    directory, filename = os.path.split(name)
    base, ext = os.path.splitext(filename)
    
    # Nettoie le nom de base (accents -> sans accents, espaces -> tirets)
    clean_base = slugify(base)
    
    # Si le nettoyage a tout supprimé (cas rare de caractères spéciaux uniquement)
    if not clean_base:
        import uuid
        clean_base = f"file-{uuid.uuid4().hex[:8]}"
        
    # Reconstruit le nom propre
    cleaned_filename = f"{clean_base}{ext.lower()}"
    return os.path.join(directory, cleaned_filename).replace('\\', '/')

class CleanS3Boto3Storage(S3Boto3Storage):
    """Stockage S3 pour Supabase avec nettoyage.
    
    Note: Ne PAS ajouter location='media' ici !
    Les chemins en base de données contiennent déjà le préfixe 'media/' 
    (ex: 'media/settings/logo.png') et AWS_S3_CUSTOM_DOMAIN dans settings.py
    inclut aussi '/media'. Ajouter location créerait un triple dossier.
    """
    
    def get_available_name(self, name, max_length=None):
        name = _clean_filename(name)
        return super().get_available_name(name, max_length)

class CleanFileSystemStorage(FileSystemStorage):
    """Stockage Local (Windows/Linux) avec nettoyage."""
    def get_available_name(self, name, max_length=None):
        name = _clean_filename(name)
        return super().get_available_name(name, max_length)
