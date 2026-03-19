import django
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'makamba.settings'
django.setup()

from api.pages.models import DiocesePresentation, TimelineEvent, VisionValue, MissionAxe, TeamMember

def fix_content():
    # Mise à jour de la présentation
    d, created = DiocesePresentation.objects.get_or_create(id=1)
    
    # Textes de base FR
    d.hero_subtitle_fr = "L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province du Burundi."
    d.history_text_fr = "Le Diocèse de Makamba a été établi pour porter la parole de Dieu et soutenir le développement communautaire. Depuis sa création, il oeuvre pour la paix, l'éducation et la santé dans toute la région de Makamba."
    d.organization_text_fr = "Notre diocèse est organisé en plusieurs paroisses et ministères, dirigés par l'Évêque, travaillant ensemble pour accomplir notre mission pastorale et sociale."
    d.bishop_message_fr = "Bienvenue sur notre espace diocésain. Que la paix du Seigneur soit avec vous. Nous sommes engagés à bâtir une communauté forte et solidaire."
    d.vision_title_fr = "Notre Vision & Mission"
    d.vision_description_fr = "Fondé sur l'Évangile, le Diocèse de Makamba s'engage à servir Dieu et les communautés à travers trois piliers fondamentaux."
    
    # Traductions EN
    d.hero_subtitle_en = "The Anglican Church of Makamba Diocese, founded in 2009, is a spiritual and social pillar of the province."
    d.history_text_en = "The Diocese of Makamba was established to carry the word of God and support community development. Since its creation, it has worked for peace, education and health throughout the Makamba region."
    d.organization_text_en = "Our diocese is organized into several parishes and ministries, led by the Bishop, working together to accomplish our pastoral and social mission."
    d.bishop_message_en = "Welcome to our diocesan space. May the peace of the Lord be with you. We are committed to building a strong and supportive community."
    d.vision_title_en = "Our Vision & Mission"
    d.vision_description_en = "Based on the Gospel, the Diocese of Makamba is committed to serving God and the communities through three fundamental pillars."
    
    d.bishop_name = "Rt. Rev. Samuel Nduwayo"
    d.save()
    print("Presentation EN/FR updated successfully!")

    # Duplication de l'historique (Timeline)
    fr_events = TimelineEvent.objects.filter(language='fr')
    for e in fr_events:
        # On vérifie si une version anglaise existe déjà pour cette année
        if not TimelineEvent.objects.filter(year=e.year, language='en').exists():
            TimelineEvent.objects.create(
                year=e.year,
                title=f"{e.title} (EN)",
                description=f"English description for: {e.description}",
                language="en",
                order=e.order,
                image=e.image
            )
            print(f"Duplicated event {e.year} to English.")

    # Duplication des Valeurs (VisionValue)
    fr_values = VisionValue.objects.filter(language='fr')
    for v in fr_values:
        if not VisionValue.objects.filter(title=v.title, language='en').exists():
            VisionValue.objects.create(
                title=f"{v.title} (EN)",
                description=f"English description for: {v.description}",
                icon=v.icon,
                image=v.image,
                language="en",
                order=v.order
            )
            print(f"Duplicated value {v.title} to English.")

    # Duplication des Axes de Mission (MissionAxe)
    fr_axes = MissionAxe.objects.filter(language='fr')
    for a in fr_axes:
        if not MissionAxe.objects.filter(text__icontains=a.text[:20], language='en').exists():
            MissionAxe.objects.create(
                text=f"Mission Axe (EN): {a.text}",
                image=a.image,
                language="en",
                order=a.order
            )
            print("Duplicated Mission Axe to English.")

    # Duplication de l'Équipe (TeamMember)
    fr_team = TeamMember.objects.filter(language='fr')
    for m in fr_team:
        if not TeamMember.objects.filter(name=m.name, language='en').exists():
            TeamMember.objects.create(
                name=m.name,
                role=f"{m.role} (EN)",
                description=f"(English translation requested) - Original: {m.description}",
                image=m.image,
                language="en",
                order=m.order
            )
            print(f"Duplicated team member {m.name} to English.")

    # Attribution des images à la chronologie
    def set_img(year_part, path):
        TimelineEvent.objects.filter(year__icontains=year_part).update(image=path)
        print(f"Updated images for year containing: {year_part}")

    set_img('1934', 'timeline/arrival_1934.png')
    set_img('1960', 'timeline/vintage_church.png')
    set_img('1992', 'timeline/vintage_church.png')
    set_img('2009', 'timeline/creation_2009.png')
    set_img('2015', 'timeline/today.png')
    set_img('ujourd', 'timeline/today.png')
    set_img('Today', 'timeline/today.png')

if __name__ == "__main__":
    fix_content()
