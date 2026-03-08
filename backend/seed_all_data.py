
import os
import django

# Configuration de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shalomministry.settings')
django.setup()

from api.parishes.models import Parish
from api.pages.models import TeamMember, TimelineEvent, MissionAxe, VisionValue
from api.settings.models import SiteSettings

def seed_data():
    print("Seeding data...")
    
    # 1. Paroisses
    if Parish.objects.count() == 0:
        parishes = [
            { "name": "Paroisse de Makamba Centre", "zone": "Makamba", "faithful": "12 000", "pastor": "Rév. Pierre Habimana", "phone": "+257 79 XX XX XX" },
            { "name": "Paroisse de Kayogoro", "zone": "Kayogoro", "faithful": "8 500", "pastor": "Rév. Emmanuel Nkurunziza", "phone": "+257 79 XX XX XX" },
            { "name": "Paroisse de Nyanza-Lac", "zone": "Nyanza-Lac", "faithful": "10 200", "pastor": "Rév. Josué Manirambona", "phone": "+257 79 XX XX XX" },
        ]
        for p in parishes:
            Parish.objects.create(**p)
        print(f"Added {len(parishes)} parishes.")

    # 2. Team Members
    if TeamMember.objects.count() == 0:
        team = [
            { "role": "Secrétaire diocésain", "name": "Rév. Jean-Pierre Niyonzima", "description": "Coordination administrative et gestion des affaires courantes du diocèse.", "order": 1 },
            { "role": "Responsable des Ministères Jeunes", "name": "Pasteur Éric Ndayisaba", "description": "Animation et encadrement de la jeunesse dans toutes les paroisses.", "order": 2 },
            { "role": "Responsable du Ministère des Femmes", "name": "Mme Espérance Niyongabo", "description": "Accompagnement et autonomisation des femmes à travers la foi.", "order": 3 },
        ]
        for t in team:
            TeamMember.objects.create(**t)
        print(f"Added {len(team)} team members.")

    # 3. Timeline
    if TimelineEvent.objects.count() == 0:
        events = [
            { "year": "2009", "title": "Création du Diocèse", "description": "Le diocèse de Makamba est officiellement érigé, se détachant du diocèse de Matana.", "order": 1 },
            { "year": "2010", "title": "Inauguration de la Cathédrale", "description": "Pose de la première pierre de la Cathédrale Saint-Pierre de Makamba.", "order": 2 },
        ]
        for e in events:
            TimelineEvent.objects.create(**e)
        print(f"Added {len(events)} timeline events.")

    # 4. Mission Axes
    if MissionAxe.objects.count() == 0:
        axes = [
            { "text": "Évangélisation et Mission", "order": 1 },
            { "text": "Éducation et Formation", "order": 2 },
            { "text": "Santé et Bien-être", "order": 3 },
            { "text": "Développement Communautaire", "order": 4 },
        ]
        for a in axes:
            MissionAxe.objects.create(**a)
        print(f"Added {len(axes)} mission axes.")

    # 5. Vision Values
    if VisionValue.objects.count() == 0:
        values = [
            { "icon": "Cross", "title": "Foi", "description": "Ancrés dans la parole de Dieu.", "order": 1 },
            { "icon": "Heart", "title": "Amour", "description": "Servir avec compassion.", "order": 2 },
            { "icon": "Users", "title": "Unité", "description": "Grandir ensemble en tant que corps Christ.", "order": 3 },
        ]
        for v in values:
            VisionValue.objects.create(**v)
        print(f"Added {len(values)} vision values.")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
