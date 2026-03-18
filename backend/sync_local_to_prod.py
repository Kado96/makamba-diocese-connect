"""
⛪ Makamba Diocese Connect - Script de Synchronisation
SQLite (Local) ➔ Supabase (Production)

Ce script permet de pousser vos données locales vers le site en production.
Utilisation: python sync_local_to_prod.py [--dry-run]
"""

import os
import sys
import django
import argparse
import logging
from django.db import transaction, connections
from django.conf import settings
import dj_database_url
from urllib.parse import unquote

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# 1. Chargement manuel du fichier .env
def load_env_file():
    dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(dotenv_path):
        with open(dotenv_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"').strip("'")
                    os.environ.setdefault(key.strip(), value.strip())

load_env_file()

# 2. Configuration de l'environnement Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')

# Sauvegarder l'URL de production depuis les variables d'environnement
prod_db_url = os.environ.get('DATABASE_URL')
if not prod_db_url:
    print("❌ ERREUR: DATABASE_URL n'est pas défini dans votre environnement.")
    print("Veuillez charger votre fichier .env ou définir la variable DATABASE_URL.")
    sys.exit(1)

# Forcer Django à utiliser SQLite pour la lecture initiale
os.environ['USE_LOCAL_SQLITE'] = 'True'
django.setup()

# 2. Imports des modèles du projet Makamba
from django.contrib.auth.models import User
from api.accounts.models import Account
from api.settings.models import SiteSettings
from api.announcements.models import Announcement
from api.testimonials.models import Testimonial
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryActivity
from api.sermons.models import SermonCategory, Sermon
from api.pages.models import TimelineEvent, VisionValue, MissionAxe, TeamMember, DiocesePresentation

class MakambaSync:

    def _setup_prod_db(self):
        """Configure la connexion secondaire pour PostgreSQL/Supabase en héritant du moteur par défaut"""
        # On parse l'URL de production
        db_config_prod = dj_database_url.parse(prod_db_url, ssl_require=True)
        db_config_prod['PASSWORD'] = unquote(db_config_prod['PASSWORD'])
        
        # On fait une copie de la configuration par défaut (pour avoir AUTOCOMMIT, TIME_ZONE, etc.)
        new_config = settings.DATABASES['default'].copy()
        new_config.update(db_config_prod)
        
        # On ajoute la config 'prod' au système Django
        settings.DATABASES['prod'] = new_config
        try:
            with connections['prod'].cursor() as cursor:
                cursor.execute("SELECT 1")
            logger.info("✅ Connexion à Supabase (Production) réussie.")
        except Exception as e:
            logger.error(f"❌ Impossible de se connecter à Supabase: {e}")
            sys.exit(1)

    def _prepare_data(self, instance):
        """Prépare les données en gérant les relations et excluant les fichiers"""
        data = {}
        for field in instance._meta.fields:
            if field.name == 'id': continue
            
            # On ne synchronise pas les fichiers binaires eux-mêmes, seulement les noms/chemins
            # Le serveur de prod s'attend à ce que les fichiers soient déjà là ou via URL
            val = getattr(instance, field.name)
            
            if field.is_relation and val:
                data[f"{field.name}_id"] = val.id
            else:
                data[field.name] = val
        return data

    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.stats = {'created': 0, 'updated': 0, 'errors': 0}
        self.id_map = {} # Stocke la correspondance { 'ModelName': { local_id: prod_id } }
        self._setup_prod_db()

    def _get_natural_query(self, model_class, item):
        """Définit comment identifier un objet sans son ID"""
        if model_class == User:
            return {'username': item.username}
        if model_class == Account:
            # Pour un profil, la clé naturelle est l'utilisateur rattaché
            # On utilise l'ID traduit (prod) si possible
            user_id = self.id_map.get('User', {}).get(item.user_id, item.user_id)
            return {'user_id': user_id}
        if model_class == SiteSettings:
            return {'id': 1} # Singleton
        if model_class == Parish:
            return {'name': item.name}
        if model_class == Ministry:
            return {'title': item.title, 'language': item.language}
        if model_class == SermonCategory:
            return {'name': item.name}
        if model_class == Sermon:
            return {'title': item.title, 'preacher_name': item.preacher_name}
        if model_class == Announcement:
            return {'title': item.title, 'language': item.language}
        if model_class == Testimonial:
            return {'author_name': item.author_name}
        if model_class == TeamMember:
            return {'name': item.name}
        return None

    def sync_model(self, model_class, name):
        """Synchronise une table avec traduction des IDs"""
        logger.info(f"--- Synchronisation: {name} ---")
        model_name = model_class.__name__
        self.id_map[model_name] = {}
        
        local_items = model_class.objects.using('default').all()
        
        for item in local_items:
            data = self._prepare_data(item)
            
            # 🔄 TRADUCTION DES CLÉS ÉTRANGÈRES
            # Si l'objet dépend d'un autre (ex: Profile -> User), on remplace l'ID local par l'ID prod
            for field in model_class._meta.fields:
                if field.is_relation:
                    # On vérifie field.name (ex: 'user') et field.name + '_id' (ex: 'user_id')
                    for key in [field.name, f"{field.name}_id"]:
                        if key in data and data[key]:
                            related_model_name = field.related_model.__name__
                            local_id = data[key]
                            if related_model_name in self.id_map and local_id in self.id_map[related_model_name]:
                                data[key] = self.id_map[related_model_name][local_id]
                                logger.debug(f"    [MAP] Traduction {key}: {local_id} -> {data[key]}")

            try:
                with transaction.atomic(using='prod'):
                    # 1. Recherche : On essaye par ID, puis par Clé Naturelle
                    prod_obj_query = model_class.objects.using('prod').filter(id=item.id)
                    
                    if not prod_obj_query.exists():
                        natural_criteria = self._get_natural_query(model_class, item)
                        if natural_criteria:
                            prod_obj_query = model_class.objects.using('prod').filter(**natural_criteria)

                    if prod_obj_query.exists():
                        # MISE À JOUR
                        prod_id = prod_obj_query.first().id
                        if not self.dry_run:
                            # On retire l'ID de la mise à jour pour ne pas casser les contraintes
                            if 'id' in data: del data['id'] 
                            prod_obj_query.update(**data)
                            self.stats['updated'] += 1
                            logger.info(f"  [UPD] {name} '{item}' (ID Prod: {prod_id}) mis à jour.")
                        else:
                            logger.info(f"  [SIM] {name} '{item}' serait mis à jour.")
                        self.id_map[model_name][item.id] = prod_id
                    else:
                        # CRÉATION
                        if not self.dry_run:
                            # Si c'est une création, on essaye de garder le même ID si possible
                            # mais si l'ID local est déjà pris en prod, on laisse la base en générer un nouveau
                            if model_class.objects.using('prod').filter(id=item.id).exists():
                                if 'id' in data: del data['id']
                            
                            new_obj = model_class.objects.using('prod').create(**data)
                            self.stats['created'] += 1
                            logger.info(f"  [NEW] {name} '{item}' créé (ID Prod: {new_obj.id}).")
                            self.id_map[model_name][item.id] = new_obj.id
                        else:
                            logger.info(f"  [SIM] {name} '{item}' serait créé.")
                            self.id_map[model_name][item.id] = item.id
            except Exception as e:
                logger.error(f"  ❌ Erreur sur {name} '{item}': {e}")
                self.stats['errors'] += 1

    def run(self):
        """Exécute la synchronisation dans l'ordre des dépendances"""
        logger.info(f"{'⚠️ MODE SIMULATION' if self.dry_run else '🚀 MODE RÉEL'}")
        
        try:
            with transaction.atomic(using='prod'):
                # 1. Base
                self.sync_model(User, "Utilisateurs")
                self.sync_model(Account, "Profils")
                self.sync_model(SiteSettings, "Paramètres Site")
                
                # 2. Contenu Indépendant
                self.sync_model(SermonCategory, "Catégories Sermons")
                self.sync_model(Testimonial, "Témoignages")
                self.sync_model(Announcement, "Annonces/Articles")
                self.sync_model(Parish, "Paroisses")
                self.sync_model(Ministry, "Ministères")
                
                # 3. Contenu Dépendant
                self.sync_model(Sermon, "Sermons")
                self.sync_model(MinistryActivity, "Activités Ministères")
                
                # 4. Pages
                self.sync_model(TimelineEvent, "Évènements Timeline")
                self.sync_model(VisionValue, "Valeurs Vision")
                self.sync_model(MissionAxe, "Axes Mission")
                self.sync_model(TeamMember, "Membres Équipe")
                self.sync_model(DiocesePresentation, "Présentation Diocèse")

            logger.info("\n" + "="*30)
            logger.info(f"RÉSULTAT: {self.stats['created']} créés, {self.stats['updated']} mis à jour, {self.stats['errors']} erreurs.")
            logger.info("="*30)
            
        except Exception as e:
            logger.error(f"❌ Erreur critique lors de la transaction: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true', help='Simuler sans modifier')
    args = parser.parse_args()
    
    sync = MakambaSync(dry_run=args.dry_run)
    sync.run()
