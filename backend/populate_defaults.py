import os
import django
from django.utils import timezone

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import TeamMember, TimelineEvent, DiocesePresentation
from api.sermons.models import Sermon, SermonCategory
from api.ministries.models import Ministry, MinistryActivity

def run():
    print("--- Démarrage du peuplement des données par défaut ---")

    # 1. Team Members
    team_data = [
        { "role": "Secrétaire diocésain", "name": "Rév. Jean-Pierre Niyonzima", "description": "Coordination administrative et gestion des affaires courantes du diocèse.", "order": 1 },
        { "role": "Responsable des Ministères Jeunes", "name": "Pasteur Éric Ndayisaba", "description": "Animation et encadrement de la jeunesse dans toutes les paroisses.", "order": 2 },
        { "role": "Responsable du Ministère des Femmes", "name": "Mme Espérance Niyongabo", "description": "Accompagnement et autonomisation des femmes à travers la foi et les projets communautaires.", "order": 3 },
        { "role": "Responsable Éducation & Santé", "name": "Dr. Clémentine Bizimana", "description": "Coordination des projets éducatifs et sanitaires du diocèse.", "order": 4 },
        { "role": "Trésorier diocésain", "name": "M. Dieudonné Hakizimana", "description": "Gestion financière et transparence des ressources du diocèse.", "order": 5 },
        { "role": "Responsable Développement communautaire", "name": "M. Pascal Ntahompagaze", "description": "Pilotage des projets de développement durable dans les communautés.", "order": 6 },
    ]

    print(f"Création de {len(team_data)} membres de l'équipe...")
    TeamMember.objects.all().delete()
    for item in team_data:
        TeamMember.objects.create(
            name=item['name'],
            role=item['role'],
            description=item['description'],
            order=item['order']
        )

    # 2. Timeline Events
    timeline_data = [
        { "year": "1934", "title": "Arrivée des premiers missionnaires", "description": "Les missionnaires anglicans de la Church Missionary Society (CMS) arrivent dans la région du Burundi.", "order": 1 },
        { "year": "1960", "title": "Croissance de l'Église", "description": "L'Église anglicane s'enracine dans les communautés locales avec la formation de pasteurs burundais.", "order": 2 },
        { "year": "1992", "title": "Province de l'Église Anglicane du Burundi", "description": "L'Église du Burundi devient une province autonome de la Communion Anglicane.", "order": 3 },
        { "year": "2009", "title": "Création du Diocèse de Makamba", "description": "Le diocèse de Makamba est officiellement érigé, avec son propre évêque et ses structures pastorales.", "order": 4 },
        { "year": "2015", "title": "Expansion des ministères", "description": "Lancement de programmes d'éducation, santé et développement communautaire à travers toute la province.", "order": 5 },
        { "year": "Aujourd'hui", "title": "Un diocèse en pleine croissance", "description": "20 paroisses, 120 000 fidèles et 4 ministères actifs au service de la communauté.", "order": 6 },
    ]

    print(f"Création de {len(timeline_data)} événements historiques...")
    TimelineEvent.objects.all().delete()
    for item in timeline_data:
        TimelineEvent.objects.create(
            year=item['year'],
            title=item['title'],
            description=item['description'],
            order=item['order']
        )

    # 3. Sermons (Videos and Documents)
    print("Création de catégories pour Ressources...")
    cat_video, _ = SermonCategory.objects.get_or_create(name="Vidéos Diocèse", description="Vidéos de présentation et événements")
    cat_doc, _ = SermonCategory.objects.get_or_create(name="Documents Officiels", description="Documents, rapports et PDFs")

    video_data = [
        { "title": "Présentation du Diocèse de Makamba", "video_url": "https://youtube.com/watch?v=demo1", "duration": 4 },
        { "title": "Camp de jeunes 2025 — Résumé", "video_url": "https://youtube.com/watch?v=demo2", "duration": 5 },
        { "title": "Inauguration du centre de santé de Kibago", "video_url": "https://youtube.com/watch?v=demo3", "duration": 3 },
        { "title": "Culte de Noël 2025 — Cathédrale de Makamba", "video_url": "https://youtube.com/watch?v=demo4", "duration": 8 },
    ]

    doc_data = [
        { "title": "Plan stratégique 2024-2028", "audio_url": "/dummy.pdf" },
        { "title": "Rapport annuel 2025", "audio_url": "/dummy.pdf" },
        { "title": "Statuts du diocèse", "audio_url": "/dummy.pdf" },
        { "title": "Règlement intérieur", "audio_url": "/dummy.pdf" },
        { "title": "Guide des paroisses", "audio_url": "/dummy.pdf" },
        { "title": "Bulletin diocésain — Janvier 2026", "audio_url": "/dummy.pdf" },
    ]

    print("Nettoyage des anciennes ressources (Sermons)...")
    Sermon.objects.all().delete()

    print(f"Création de {len(video_data)} vidéos...")
    for item in video_data:
        Sermon.objects.create(
            title=item['title'],
            category=cat_video,
            content_type='youtube',
            description="Vidéo d'archive.",
            video_url=item['video_url'],
            duration_minutes=item['duration'],
            sermon_date=timezone.now()
        )

    print(f"Création de {len(doc_data)} documents...")
    for item in doc_data:
        Sermon.objects.create(
            title=item['title'],
            category=cat_doc,
            content_type='audio', # Using audio content type to store docs for now based on frontend logic
            description="Document administratif.",
            audio_url=item['audio_url'],
            sermon_date=timezone.now()
        )


    # 4. Diocese Presentation
    print("Création de la présentation du diocèse...")
    presentation, _ = DiocesePresentation.objects.get_or_create(id=1)
    presentation.history_text = "L'Église Anglicane du Burundi est issue de l'œuvre missionnaire de la Church Missionary Society, arrivée vers 1934. Le Diocèse de Makamba, pour sa part, a été érigé en Région Épiscopale en 1997. D'abord membre du Diocèse de Matana, puis du Diocèse de Rumonge après la partition de 2013.\n\nC'est le 24 Mai 2009 que Makamba est définitivement indépendant et compte désormais 20 Paroisses reparties dans deux Archidiaconés : Nyanza-Lac et Makamba."
    presentation.bishop_name = "Rt. Rev. Martin Blaise Nyaboho"
    presentation.bishop_message = "Grâce et paix à vous ! Le Diocèse de Makamba est engagé dans la mission intégrale : proclamer l'Évangile, faires des disciples, prendre soin des plus vulnérables et bâtir une communauté résiliente dans l'amour du Christ."
    presentation.organization_text = "Notre diocèse est organisé autour de plusieurs départements dédiés (Santé, Éducation, Développement, Ministères Spécialisés) regroupés sous le Secrétariat exécutif pour garantir l'impact réel de l'Église sur la société."
    presentation.save()

    print("--- Peuplement terminé avec succès ! ---")

    # 5. Ministries
    print("Création des ministères...")
    Ministry.objects.all().delete()

    jeunes = Ministry.objects.create(
        title="Ministère des Jeunes",
        mission="Former la jeunesse dans la foi chrétienne et l'accompagner vers un avenir porteur d'espérance.",
        icon="Users",
        testimony_quote="Le groupe de jeunes m'a donné confiance en moi et une famille spirituelle. Aujourd'hui, je sers ma communauté avec joie.",
        testimony_author="Pacifique, 22 ans — Paroisse de Makamba Centre",
        image="ministries/jeunes.png"
    )
    MinistryActivity.objects.create(ministry=jeunes, title="Groupes de prière et d'étude biblique")
    MinistryActivity.objects.create(ministry=jeunes, title="Camps et retraites spirituelles")
    MinistryActivity.objects.create(ministry=jeunes, title="Formations en leadership")
    MinistryActivity.objects.create(ministry=jeunes, title="Activités sportives et culturelles")
    MinistryActivity.objects.create(ministry=jeunes, title="Projets d'entrepreneuriat jeunesse")

    femmes = Ministry.objects.create(
        title="Ministère des Femmes",
        mission="Encourager et autonomiser les femmes à travers la foi, la solidarité et le développement de compétences.",
        icon="Heart",
        testimony_quote="Grâce au groupe d'épargne de notre paroisse, j'ai pu ouvrir un petit commerce et subvenir aux besoins de mes enfants.",
        testimony_author="Espérance, mère de 4 enfants — Paroisse de Kayogoro",
        image="ministries/femmes.png"
    )
    MinistryActivity.objects.create(ministry=femmes, title="Cercles de prière hebdomadaires")
    MinistryActivity.objects.create(ministry=femmes, title="Formations en couture et artisanat")
    MinistryActivity.objects.create(ministry=femmes, title="Groupes d'épargne et de crédit")
    MinistryActivity.objects.create(ministry=femmes, title="Sensibilisation à la santé maternelle")
    MinistryActivity.objects.create(ministry=femmes, title="Conférences et séminaires")

    education = Ministry.objects.create(
        title="Éducation & Santé",
        mission="Promouvoir l'accès à une éducation de qualité et à des soins de santé pour les communautés vulnérables.",
        icon="BookOpen",
        testimony_quote="L'école du diocèse a changé ma vie. Sans la bourse, je n'aurais jamais pu étudier et devenir institutrice.",
        testimony_author="Claudine, enseignante — Vugizo",
        image="ministries/education.png"
    )
    MinistryActivity.objects.create(ministry=education, title="Écoles primaires et secondaires diocésaines")
    MinistryActivity.objects.create(ministry=education, title="Bourses scolaires pour enfants défavorisés")
    MinistryActivity.objects.create(ministry=education, title="Centres de santé communautaires")
    MinistryActivity.objects.create(ministry=education, title="Campagnes de vaccination et sensibilisation")
    MinistryActivity.objects.create(ministry=education, title="Formation des enseignants et agents de santé")

    dev_comm = Ministry.objects.create(
        title="Développement communautaire",
        mission="Accompagner les communautés vers un développement durable, solidaire et ancré dans les valeurs de l'Évangile.",
        icon="Sprout",
        testimony_quote="Le projet agricole nous a appris de nouvelles techniques. Notre récolte a doublé cette année, et toute la communauté en profite.",
        testimony_author="Jean-Baptiste, agriculteur — Mabanda",
        image="ministries/developpement.png"
    )
    MinistryActivity.objects.create(ministry=dev_comm, title="Projets agricoles et élevage")
    MinistryActivity.objects.create(ministry=dev_comm, title="Accès à l'eau potable")
    MinistryActivity.objects.create(ministry=dev_comm, title="Construction de logements sociaux")
    MinistryActivity.objects.create(ministry=dev_comm, title="Protection de l'environnement")
    MinistryActivity.objects.create(ministry=dev_comm, title="Formation professionnelle")

if __name__ == '__main__':
    run()
