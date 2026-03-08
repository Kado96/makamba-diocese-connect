from django.db import models
from django.core.cache import cache


class SiteSettings(models.Model):
    """Paramètres du site (singleton - une seule instance)"""
    
    # Informations générales
    site_name = models.CharField(max_length=200, default="Diocese Makamba")
    description = models.TextField(blank=True, default="Site officiel du Diocese Makamba Connect")
    
    DEFAULT_LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Swahili'),
    ]
    default_language = models.CharField(
        max_length=2, 
        choices=DEFAULT_LANGUAGE_CHOICES, 
        default='fr',
        help_text="Langue par défaut du site"
    )
    
    # Logo & Hero
    logo = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Logo du site")
    logo_url = models.URLField(blank=True, help_text="OU URL du logo (si pas d'upload)")
    hero_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond de la section Héro")
    
    # Images des sections
    about_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de la section À Propos (ex: église)")
    team_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Photo de l'équipe")
    quote_author_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Photo du pasteur pour la citation")
    
    # Citation du pasteur (multilingue)
    # Français
    quote_text_fr = models.TextField(blank=True, default="La Parole de Dieu est une puissance qui transforme les vies et bâtit les communautés.", help_text="Citation de l'Évêque")
    quote_author_name_fr = models.CharField(max_length=200, blank=True, default="Mgr Samuel Nduwayo")
    quote_author_subtitle_fr = models.CharField(max_length=200, blank=True, default="Évêque du Diocèse de Makamba")
    # Kirundi
    quote_text_rn = models.TextField(blank=True, default="Ijambo ry'Imana si inkuru gusa, ni ububasha bwongera kubumba ubugingo bukagorora umutima.")
    quote_author_name_rn = models.CharField(max_length=200, blank=True, default="Mgr Samuel Nduwayo")
    quote_author_subtitle_rn = models.CharField(max_length=200, blank=True, default="Umwepiskopi wa Diyoseze ya Makamba")
    # English
    quote_text_en = models.TextField(blank=True, default="The Word of God is not just a story, it is a power that recreates the soul and aligns the spirit.")
    quote_author_name_en = models.CharField(max_length=200, blank=True, default="Rt. Rev. Samuel Nduwayo")
    quote_author_subtitle_en = models.CharField(max_length=200, blank=True, default="Bishop of Makamba Diocese")
    # Swahili
    quote_text_sw = models.TextField(blank=True, default="Neno la Mungu ni nguvu inayobadilisha maisha na kujenga jamii.")
    quote_author_name_sw = models.CharField(max_length=200, blank=True, default="Askofu Samuel Nduwayo")
    quote_author_subtitle_sw = models.CharField(max_length=200, blank=True, default="Askofu wa Jimbo la Makamba")
    
    # Section Équipe (multilingue)
    # Français
    team_title_fr = models.CharField(max_length=200, blank=True, default="Notre Équipe")
    team_description_fr = models.TextField(blank=True, default="Une équipe dévouée au service du Royaume pour vous accompagner dans votre parcours chrétien.")
    # Kirundi
    team_title_rn = models.CharField(max_length=200, blank=True, default="Umurwi wacu")
    team_description_rn = models.TextField(blank=True, default="Umurwi utizigira gukora igikorwa c'Ubwami kugira ngo ugufatanye mu rugendo rwawe rw'ubukirisu.")
    # English
    team_title_en = models.CharField(max_length=200, blank=True, default="Our Team")
    team_description_en = models.TextField(blank=True, default="A team dedicated to serving the Kingdom to accompany you in your Christian journey.")
    # Swahili
    team_title_sw = models.CharField(max_length=200, blank=True, default="Timu Yetu")
    team_description_sw = models.TextField(blank=True, default="Timu iliyojitolea kutumikia Ufalme ili kukufuatana katika safari yako ya Kikristo.")
    
    # Titles of features About (multilingual)
    # Français
    about_feature1_fr = models.CharField(max_length=100, blank=True, default="Enseignement Biblique")
    about_feature2_fr = models.CharField(max_length=100, blank=True, default="Guérison du Cœur")
    about_feature3_fr = models.CharField(max_length=100, blank=True, default="Éveil Spirituel")
    about_feature4_fr = models.CharField(max_length=100, blank=True, default="Nos Engagements")
    # Kirundi
    about_feature1_rn = models.CharField(max_length=100, blank=True, default="Inyigisho za Bibiliya")
    about_feature2_rn = models.CharField(max_length=100, blank=True, default="Gukiza Umutima")
    about_feature3_rn = models.CharField(max_length=100, blank=True, default="Ikangura ry'Umutima")
    about_feature4_rn = models.CharField(max_length=100, blank=True, default="Ibikorwa vyacu")
    # English
    about_feature1_en = models.CharField(max_length=100, blank=True, default="Biblical Teaching")
    about_feature2_en = models.CharField(max_length=100, blank=True, default="Heart Healing")
    about_feature3_en = models.CharField(max_length=100, blank=True, default="Spiritual Awakening")
    about_feature4_en = models.CharField(max_length=100, blank=True, default="Our Commitments")
    # Swahili
    about_feature1_sw = models.CharField(max_length=100, blank=True, default="Mafundisho ya Biblia")
    about_feature2_sw = models.CharField(max_length=100, blank=True, default="Uponyaji wa Moyo")
    about_feature3_sw = models.CharField(max_length=100, blank=True, default="Uamsho wa Kiroho")
    about_feature4_sw = models.CharField(max_length=100, blank=True, default="Ahadi Zetu")
    
    # Contact
    contact_email = models.EmailField(blank=True, default="info@makamba-diocese.org")
    contact_phone = models.CharField(max_length=50, blank=True, default="+257 22 23 45 67")
    contact_address = models.TextField(blank=True, default="Makamba, Burundi")
    
    # Réseaux sociaux
    facebook_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    whatsapp_url = models.URLField(blank=True)
    
    # Contenu pages (par langue)
    # Français
    hero_badge_fr = models.CharField(max_length=150, blank=True, default="ÉGLISE ANGLICANE DU BURUNDI")
    hero_title_fr = models.CharField(max_length=200, blank=True, default="Diocèse de Makamba")
    hero_subtitle_fr = models.TextField(blank=True, default="Servir Dieu et notre prochain au cœur de Makamba. Annoncer l'Évangile, bâtir la paix, promouvoir l'éducation et la solidarité.")
    hero_btn1_text_fr = models.CharField(max_length=100, blank=True, default="Gundua diyosisi")
    hero_btn1_link_fr = models.CharField(max_length=255, blank=True, default="/diocese")
    hero_btn2_text_fr = models.CharField(max_length=100, blank=True, default="Maisha ya diyosisi")
    hero_btn2_link_fr = models.CharField(max_length=255, blank=True, default="/ministeres")
    about_content_fr = models.TextField(blank=True, default="Bienvenue sur le site du Diocese Makamba, une communauté dédiée à la croissance spirituelle.")
    about_title_fr = models.CharField(max_length=200, blank=True, default="Notre Histoire")
    about_title_accent_fr = models.CharField(max_length=200, blank=True, default="& Vision")
    about_badge_fr = models.CharField(max_length=100, blank=True, default="À Propos")
    contact_content_fr = models.TextField(blank=True, default="Contactez-nous pour toute question ou demande.")
    contact_badge_fr = models.CharField(max_length=100, blank=True, default="Contact")
    
    # Verset biblique - Français
    bible_verse_fr = models.TextField(blank=True, default="Que le Dieu de l'espérance vous remplisse de toute joie et de toute paix dans la foi, pour que vous abondiez en espérance par la puissance du Saint-Esprit !")
    bible_verse_ref_fr = models.CharField(max_length=50, blank=True, default="Romains 15:13")
    
    # Boutons - Français
    btn_emissions_fr = models.CharField(max_length=100, blank=True, default="Émissions")
    btn_teachings_fr = models.CharField(max_length=100, blank=True, default="Enseignements")
    btn_meditation_fr = models.CharField(max_length=100, blank=True, default="Paroles de méditation")
    
    # Diocese & Page Intros (multilingue)
    # Français
    diocese_subtitle_fr = models.TextField(blank=True, default="L'Église Anglicane du Diocèse de Makamba, fondée en 2009, est un pilier spirituel et social de la province de Makamba au Burundi.")
    history_subtitle_fr = models.TextField(blank=True, default="Des origines missionnaires à un diocèse enraciné au cœur de Makamba.")
    history_intro_title_fr = models.CharField(max_length=255, blank=True, default="Les origines")
    history_intro_text_fr = models.TextField(blank=True, default="L'histoire de l'anglicanisme au Burundi remonte aux premières missions...")
    vision_subtitle_fr = models.TextField(blank=True, default="Notre boussole spirituelle et notre engagement concret au service des communautés de Makamba.")
    vision_text_fr = models.TextField(blank=True, default="« Être une Église vivante, ancrée dans l'Évangile... »")
    mission_intro_fr = models.TextField(blank=True, default="Le diocèse de Makamba s'engage à travers six axes missionnels complémentaires :")
    
    # Leadership
    bishop_bio_p1_fr = models.TextField(blank=True, default="Ordonné prêtre en 1995, Mgr Samuel Nduwayo a consacré sa vie au service de l'Église...")
    bishop_bio_p2_fr = models.TextField(blank=True, default="Sa vision d'une Église engagée socialement a permis le développement de projets...")

    # Stats - Valeurs (universelles)
    stat_years_value = models.CharField(max_length=50, blank=True, default="25+")
    stat_emissions_value = models.CharField(max_length=50, blank=True, default="120+")
    stat_audience_value = models.CharField(max_length=50, blank=True, default="8K")
    stat_languages_value = models.CharField(max_length=50, blank=True, default="15")

    # Stats - Labels (multilingues)
    # Français
    stat_years_label_fr = models.CharField(max_length=100, blank=True, default="Années de service")
    stat_emissions_fr = models.CharField(max_length=50, blank=True, default="Émissions")
    stat_audience_fr = models.CharField(max_length=50, blank=True, default="Auditeurs")
    stat_languages_fr = models.CharField(max_length=50, blank=True, default="Thématiques")
    
    # Kirundi
    stat_years_label_rn = models.CharField(max_length=100, blank=True, default="Imyaka y'umurimo")
    stat_emissions_rn = models.CharField(max_length=50, blank=True, default="Imitangire")
    stat_audience_rn = models.CharField(max_length=50, blank=True, default="Abatega")
    stat_languages_rn = models.CharField(max_length=50, blank=True, default="Indimi")

    # English
    stat_years_label_en = models.CharField(max_length=100, blank=True, default="Years of Service")
    stat_emissions_en = models.CharField(max_length=50, blank=True, default="Broadcasts")
    stat_audience_en = models.CharField(max_length=50, blank=True, default="Listeners")
    stat_languages_en = models.CharField(max_length=50, blank=True, default="Languages")

    # Swahili
    stat_years_label_sw = models.CharField(max_length=100, blank=True, default="Miaka ya Huduma")
    stat_emissions_sw = models.CharField(max_length=50, blank=True, default="Matangazo")
    stat_audience_sw = models.CharField(max_length=50, blank=True, default="Wasikilizaji")
    stat_languages_sw = models.CharField(max_length=50, blank=True, default="Lugha")
    
    section_featured_fr = models.CharField(max_length=100, blank=True, default="Émissions en vedette")
    section_featured_badge_fr = models.CharField(max_length=100, blank=True, default="Nouveauté")
    section_featured_accent_fr = models.CharField(max_length=100, blank=True, default="Vidéos")
    section_featured_desc_fr = models.TextField(blank=True, default="Découvrez nos dernières productions")
    
    section_categories_fr = models.CharField(max_length=100, blank=True, default="Catégories")
    section_categories_accent_fr = models.CharField(max_length=100, blank=True, default="Emissions")
    section_categories_desc_fr = models.TextField(blank=True, default="Explorez nos différentes catégories d'émissions pour enrichir votre vie spirituelle")

    section_announcements_badge_fr = models.CharField(max_length=100, blank=True, default="Annonces")
    section_announcements_title_fr = models.CharField(max_length=200, blank=True, default="Infos & Événements")
    section_announcements_accent_fr = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_fr = models.TextField(blank=True, default="Restez informé des activités de notre ministère")

    section_testimonials_badge_fr = models.CharField(max_length=100, blank=True, default="Témoignages")
    section_testimonials_title_fr = models.CharField(max_length=200, blank=True, default="Ce qu'ils disent")
    section_testimonials_accent_fr = models.CharField(max_length=100, blank=True, default="de nous")
    section_testimonials_desc_fr = models.TextField(blank=True, default="Découvrez comment le Diocese Makamba transforme des vies")
    
    # Section Vision (multilingue)
    vision_title_fr = models.CharField(max_length=200, blank=True, default="Notre vision et notre mission")
    vision_description_fr = models.TextField(blank=True, default="Fondé sur l'Évangile, le Diocèse de Makamba s'engage à servir Dieu et les communautés à travers trois piliers fondamentaux.")
    
    # Piliers Vision (FR)
    vision_pillar1_title_fr = models.CharField(max_length=200, blank=True, default="Foi vivante")
    vision_pillar1_desc_fr = models.TextField(blank=True, default="Une vie sacramentelle riche, ancrée dans la liturgie anglicane et la prière communautaire au quotidien.")
    vision_pillar1_icon = models.CharField(max_length=50, blank=True, default="Cross")
    
    vision_pillar2_title_fr = models.CharField(max_length=200, blank=True, default="Enracinement local")
    vision_pillar2_desc_fr = models.TextField(blank=True, default="Des paroisses proches des communautés, avec des équipes engagées issues du terroir de Makamba.")
    vision_pillar2_icon = models.CharField(max_length=50, blank=True, default="MapPin")
    
    vision_pillar3_title_fr = models.CharField(max_length=200, blank=True, default="Engagement social")
    vision_pillar3_desc_fr = models.TextField(blank=True, default="Éducation, santé et développement communautaire : agir concrètement pour transformer les vies.")
    vision_pillar3_icon = models.CharField(max_length=50, blank=True, default="Lightbulb")

    # Section Engagement (multilingue)
    engage_title_fr = models.CharField(max_length=200, blank=True, default="S'engager avec le diocèse")
    engage_description_fr = models.TextField(blank=True, default="Chacun a un rôle à jouer dans la mission de notre Église")
    
    # Points d'engagement (FR)
    engage_item1_title_fr = models.CharField(max_length=200, blank=True, default="Rejoindre un ministère")
    engage_item1_desc_fr = models.TextField(blank=True, default="Jeunes, femmes, éducation… Trouvez votre place dans la vie du diocèse.")
    engage_item1_cta_fr = models.CharField(max_length=100, blank=True, default="Découvrir les ministères")
    engage_item1_href = models.CharField(max_length=255, blank=True, default="/ministeres")
    engage_item1_icon = models.CharField(max_length=50, blank=True, default="Users")
    
    engage_item2_title_fr = models.CharField(max_length=200, blank=True, default="Soutenir un projet")
    engage_item2_desc_fr = models.TextField(blank=True, default="Participez au financement de nos projets d'éducation, santé et développement.")
    engage_item2_cta_fr = models.CharField(max_length=100, blank=True, default="Faire un don")
    engage_item2_href = models.CharField(max_length=255, blank=True, default="/contact")
    engage_item2_icon = models.CharField(max_length=50, blank=True, default="HandHeart")
    
    engage_item3_title_fr = models.CharField(max_length=200, blank=True, default="Participer à la prière")
    engage_item3_desc_fr = models.TextField(blank=True, default="Rejoignez nos groupes de prière, retraites spirituelles et célébrations.")
    engage_item3_cta_fr = models.CharField(max_length=100, blank=True, default="Voir l'agenda")
    engage_item3_href = models.CharField(max_length=255, blank=True, default="/actualites")
    engage_item3_icon = models.CharField(max_length=50, blank=True, default="BookOpen")

    # Section Paroisses (multilingue)
    parishes_title_fr = models.CharField(max_length=200, blank=True, default="Nos paroisses")
    parishes_description_fr = models.TextField(blank=True, default="Le diocèse de Makamba compte une vingtaine de paroisses réparties dans toute la province...")
    parishes_map_title_fr = models.CharField(max_length=200, blank=True, default="Province de Makamba")
    parishes_map_subtitle_fr = models.CharField(max_length=200, blank=True, default="Burundi, Afrique de l'Est")
    parishes_map_stats_fr = models.CharField(max_length=200, blank=True, default="20 paroisses • 8 communes")
    
    # Kirundi
    vision_title_rn = models.CharField(max_length=200, blank=True, default="Ivyo twiyemeje n’irangamana ryacu")
    vision_description_rn = models.TextField(blank=True, default="Diyoseze ya Makamba ishingiye ku Njili, yiyemeje gukorera Imana n'abanyagihugu biciye mu nkingi zitatu zishinze.")
    vision_pillar1_title_rn = models.CharField(max_length=200, blank=True, default="Ukwizera kuzima")
    vision_pillar1_desc_rn = models.TextField(blank=True, default="Ubuzima bw'amasakaramentu butunze, bushingiye kuri liturujiya ya Anglikana n'isengesho ry'ishengero rya buri musi.")
    vision_pillar2_title_rn = models.CharField(max_length=200, blank=True, default="Gushinga imizi aho turi")
    vision_pillar2_desc_rn = models.TextField(blank=True, default="Ibishengero biri hafi y'abanyagihugu, birimwo imirwi ikuye amaboko mu mufuko ikomoka mu ntara ya Makamba.")
    vision_pillar3_title_rn = models.CharField(max_length=200, blank=True, default="Gufatanya n’abanyagihugu")
    vision_pillar3_desc_rn = models.TextField(blank=True, default="Inyigisho, amagara y'abantu n'iterambere ry'abanyagihugu: gukora ibintu biboneka kugira ngo ubuzima bwahinduke.")

    engage_title_rn = models.CharField(max_length=200, blank=True, default="Gukorana na Diyoseze")
    engage_description_rn = models.TextField(blank=True, default="Umwe wese afise uruhara mu gikorwa c'Ishengero ryacu")
    engage_item1_title_rn = models.CharField(max_length=200, blank=True, default="Kwinjira mu busuku")
    engage_item1_desc_rn = models.TextField(blank=True, default="Uwaruka, abakenyezi, inyigisho... Rondera ikibanza cawe mu buzima bwa diyoseze.")
    engage_item1_cta_rn = models.CharField(max_length=100, blank=True, default="Kumenya ubusuku")
    engage_item2_title_rn = models.CharField(max_length=200, blank=True, default="Gushigikira umugambi")
    engage_item2_desc_rn = models.TextField(blank=True, default="Tabara mu gushira mu ngiro imigambi y'inyigisho, amagara y'abantu n'iterambere.")
    engage_item2_cta_rn = models.CharField(max_length=100, blank=True, default="Gutanga intererano")
    engage_item3_title_rn = models.CharField(max_length=200, blank=True, default="Gusenga hamwe")
    engage_item3_desc_rn = models.TextField(blank=True, default="Injira mu mirwi y'isengesho, mu bihe vyo kwisanzura no mu birori.")
    engage_item3_cta_rn = models.CharField(max_length=100, blank=True, default="Raba gahunda")

    parishes_title_rn = models.CharField(max_length=200, blank=True, default="Ibishengero vyacu")
    parishes_description_rn = models.TextField(blank=True, default="")
    parishes_map_title_rn = models.CharField(max_length=200, blank=True, default="Intara ya Makamba")
    parishes_map_subtitle_rn = models.CharField(max_length=200, blank=True, default="Uburundi, Afrika y'ubuseruko")
    parishes_map_stats_rn = models.CharField(max_length=200, blank=True, default="Ibishengero 20 • Ikomine 8")

    # English
    vision_title_en = models.CharField(max_length=200, blank=True, default="Our Vision and Mission")
    vision_description_en = models.TextField(blank=True, default="Rooted in the Gospel, the Diocese of Makamba is committed to serving God and communities through three fundamental pillars.")
    vision_pillar1_title_en = models.CharField(max_length=200, blank=True, default="Living Faith")
    vision_pillar1_desc_en = models.TextField(blank=True, default="A rich sacramental life, rooted in Anglican liturgy and daily community prayer.")
    vision_pillar2_title_en = models.CharField(max_length=200, blank=True, default="Local Rooting")
    vision_pillar2_desc_en = models.TextField(blank=True, default="Parishes close to communities, with dedicated teams from the local Makamba area.")
    vision_pillar3_title_en = models.CharField(max_length=200, blank=True, default="Social Engagement")
    vision_pillar3_desc_en = models.TextField(blank=True, default="Education, health and community development: concrete action to transform lives.")

    engage_title_en = models.CharField(max_length=200, blank=True, default="Engage with the Diocese")
    engage_description_en = models.TextField(blank=True, default="Everyone has a role to play in the mission of our Church")
    engage_item1_title_en = models.CharField(max_length=200, blank=True, default="Join a ministry")
    engage_item1_desc_en = models.TextField(blank=True, default="Youth, women, education… Find your place in the life of the diocese.")
    engage_item1_cta_en = models.CharField(max_length=100, blank=True, default="Discover ministries")
    engage_item2_title_en = models.CharField(max_length=200, blank=True, default="Support a project")
    engage_item2_desc_en = models.TextField(blank=True, default="Participate in funding our education, health, and development projects.")
    engage_item2_cta_en = models.CharField(max_length=100, blank=True, default="Make a donation")
    engage_item3_title_en = models.CharField(max_length=200, blank=True, default="Participate in prayer")
    engage_item3_desc_en = models.TextField(blank=True, default="Join our prayer groups, spiritual retreats, and celebrations.")
    engage_item3_cta_en = models.CharField(max_length=100, blank=True, default="See calendar")

    parishes_title_en = models.CharField(max_length=200, blank=True, default="Our Parishes")
    parishes_description_en = models.TextField(blank=True, default="")
    parishes_map_title_en = models.CharField(max_length=200, blank=True, default="Makamba Province")
    parishes_map_subtitle_en = models.CharField(max_length=200, blank=True, default="Burundi, East Africa")
    parishes_map_stats_en = models.CharField(max_length=200, blank=True, default="20 parishes • 8 communes")

    # Swahili
    vision_title_sw = models.CharField(max_length=200, blank=True, default="Maono na Utume Wetu")
    vision_description_sw = models.TextField(blank=True, default="Likizikwa katika Injili, Jimbo la Makamba limejitolea kumtumikia Mungu na jamii kupitia nguzo tatu za msingi.")
    vision_pillar1_title_sw = models.CharField(max_length=200, blank=True, default="Imani Hai")
    vision_pillar1_desc_sw = models.TextField(blank=True, default="Maisha tajiri ya kisakramenti, yaliyozikwa katika liturujia ya Kianglikana na sala ya kila siku ya jamii.")
    vision_pillar2_title_sw = models.CharField(max_length=200, blank=True, default="Kushika Mizizi")
    vision_pillar2_desc_sw = models.TextField(blank=True, default="Parokia zilizo karibu na jamii, zikiwa na timu zilizojitolea kutoka eneo la Makamba.")
    vision_pillar3_title_sw = models.CharField(max_length=200, blank=True, default="Kujitolea kwa Jamii")
    vision_pillar3_desc_sw = models.TextField(blank=True, default="Elimu, afya na maendeleo ya jamii: kuchukua hatua thabiti kubadilisha maisha.")

    engage_title_sw = models.CharField(max_length=200, blank=True, default="Shiriki na Jimbo")
    engage_description_sw = models.TextField(blank=True, default="Kila mmoja ana jukumu la kutoa katika misheni ya Kanisa letu")
    engage_item1_title_sw = models.CharField(max_length=200, blank=True, default="Jiunge na huduma")
    engage_item1_desc_sw = models.TextField(blank=True, default="Vijana, wanawake, elimu... Pata nafasi yako katika maisha ya jimbo.")
    engage_item1_cta_sw = models.CharField(max_length=100, blank=True, default="Gundua huduma")
    engage_item2_title_sw = models.CharField(max_length=200, blank=True, default="Saidia mradi")
    engage_item2_desc_sw = models.TextField(blank=True, default="Shiriki katika kufadhili miradi yetu ya elimu, afya, na maendeleo.")
    engage_item2_cta_sw = models.CharField(max_length=100, blank=True, default="Toa msaada")
    engage_item3_title_sw = models.CharField(max_length=200, blank=True, default="Shiriki katika maombi")
    engage_item3_desc_sw = models.TextField(blank=True, default="Jiunge na vikundi vyetu vya maombi, mapumziko ya kiroho, na sherehe.")
    engage_item3_cta_sw = models.CharField(max_length=100, blank=True, default="Angalia kalenda")

    # ═══════════════════════════════════════════
    # Section Actualités / Stories (multilingue)
    # ═══════════════════════════════════════════
    stories_badge_fr = models.CharField(max_length=100, blank=True, default="Sur le terrain")
    stories_title_fr = models.CharField(max_length=200, blank=True, default="Toute l'actualité de nos actions")
    stories_badge_rn = models.CharField(max_length=100, blank=True, default="Ku kibanza")
    stories_title_rn = models.CharField(max_length=200, blank=True, default="Amakuru yose y'ibikorwa vyacu")
    stories_badge_en = models.CharField(max_length=100, blank=True, default="On the ground")
    stories_title_en = models.CharField(max_length=200, blank=True, default="All the latest from our actions")
    stories_badge_sw = models.CharField(max_length=100, blank=True, default="Uwanjani")
    stories_title_sw = models.CharField(max_length=200, blank=True, default="Habari zote za vitendo vyetu")

    # Stats CTA (multilingue)
    stats_cta_title_fr = models.CharField(max_length=200, blank=True, default="Découvrir le diocèse")
    stats_cta_link_text_fr = models.CharField(max_length=100, blank=True, default="En savoir plus")
    stats_cta_title_rn = models.CharField(max_length=200, blank=True, default="Kumenya diyoseze")
    stats_cta_link_text_rn = models.CharField(max_length=100, blank=True, default="Ibindi")
    stats_cta_title_en = models.CharField(max_length=200, blank=True, default="Discover the diocese")
    stats_cta_link_text_en = models.CharField(max_length=100, blank=True, default="Learn more")
    stats_cta_title_sw = models.CharField(max_length=200, blank=True, default="Gundua jimbo")
    stats_cta_link_text_sw = models.CharField(max_length=100, blank=True, default="Soma zaidi")
    stats_cta_href = models.CharField(max_length=255, blank=True, default="/diocese")

    # Stats descriptions (multilingue)
    stat_years_desc_fr = models.CharField(max_length=200, blank=True, default="au service de Dieu")
    stat_years_desc_rn = models.CharField(max_length=200, blank=True, default="mu gikorwa c'Imana")
    stat_years_desc_en = models.CharField(max_length=200, blank=True, default="serving God")
    stat_years_desc_sw = models.CharField(max_length=200, blank=True, default="katika huduma ya Mungu")
    stat_emissions_desc_fr = models.CharField(max_length=200, blank=True, default="Diffusées")
    stat_emissions_desc_rn = models.CharField(max_length=200, blank=True, default="Zasabwe")
    stat_emissions_desc_en = models.CharField(max_length=200, blank=True, default="Broadcast")
    stat_emissions_desc_sw = models.CharField(max_length=200, blank=True, default="Zimetangazwa")
    stat_audience_desc_fr = models.CharField(max_length=200, blank=True, default="Audience globale")
    stat_audience_desc_rn = models.CharField(max_length=200, blank=True, default="Abatega bose")
    stat_audience_desc_en = models.CharField(max_length=200, blank=True, default="Global audience")
    stat_audience_desc_sw = models.CharField(max_length=200, blank=True, default="Watazamaji wote")
    stat_languages_desc_fr = models.CharField(max_length=200, blank=True, default="Abordées")
    stat_languages_desc_rn = models.CharField(max_length=200, blank=True, default="Zishikirijwe")
    stat_languages_desc_en = models.CharField(max_length=200, blank=True, default="Covered")
    stat_languages_desc_sw = models.CharField(max_length=200, blank=True, default="Zimefunikwa")

    # Section background images
    vision_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Vision")
    engage_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Engagement")
    stories_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Actualités")
    parishes_bg_image = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Image de fond section Paroisses")

    # Footer brand
    footer_brand_name = models.CharField(max_length=200, blank=True, default="Diocèse de Makamba")
    footer_brand_subtitle = models.CharField(max_length=300, blank=True, default="Église Anglicane du Burundi. Servir Dieu et notre prochain au cœur de Makamba.")

    parishes_title_sw = models.CharField(max_length=200, blank=True, default="Parokia Zetu")
    parishes_description_sw = models.TextField(blank=True, default="")
    parishes_map_title_sw = models.CharField(max_length=200, blank=True, default="Mkoa wa Makamba")
    parishes_map_subtitle_sw = models.CharField(max_length=200, blank=True, default="Burundi, Afrika Mashariki")
    parishes_map_stats_sw = models.CharField(max_length=200, blank=True, default="Parokia 20 • Komini 8")

    # Hero Section (multilingue)
    hero_badge_rn = models.CharField(max_length=150, blank=True, default="ISHENGERO RYA ANGLIKANA MU BURUNDI")
    hero_title_rn = models.CharField(max_length=200, blank=True, default="Diocèse de Makamba")
    hero_subtitle_rn = models.TextField(blank=True, default="Servir Dieu et notre prochain au cœur de Makamba.")
    hero_btn1_text_rn = models.CharField(max_length=100, blank=True, default="Gundua diyosisi")
    hero_btn1_link_rn = models.CharField(max_length=255, blank=True, default="/diocese")
    hero_btn2_text_rn = models.CharField(max_length=100, blank=True, default="Maisha ya diyosisi")
    hero_btn2_link_rn = models.CharField(max_length=255, blank=True, default="/ministeres")
    about_content_rn = models.TextField(blank=True, default="")
    about_title_rn = models.CharField(max_length=200, blank=True, default="Amateka yacu")
    about_title_accent_rn = models.CharField(max_length=200, blank=True, default="& Vision")
    about_badge_rn = models.CharField(max_length=100, blank=True, default="Ibitwerekeye")
    contact_content_rn = models.TextField(blank=True, default="")
    contact_badge_rn = models.CharField(max_length=100, blank=True, default="Twandikire")
    
    bible_verse_rn = models.TextField(blank=True, default="Imana y'ihuze ikuzuze amarara yose n'amahoro mu kwizera, kugira ngo muhenuke mw'ihuze ku mbaraga z'Umupfumu Mutagatifu!")
    bible_verse_ref_rn = models.CharField(max_length=50, blank=True, default="Abaroma 15:13")
    
    btn_emissions_rn = models.CharField(max_length=100, blank=True, default="Imitangire")
    btn_teachings_rn = models.CharField(max_length=100, blank=True, default="Inyigisho")
    btn_meditation_rn = models.CharField(max_length=100, blank=True, default="Amagambo yo gutekereza")
    
    section_featured_rn = models.CharField(max_length=100, blank=True, default="Imitangire ikomeye")
    section_featured_badge_rn = models.CharField(max_length=100, blank=True, default="Gishasha")
    section_featured_accent_rn = models.CharField(max_length=100, blank=True, default="Vidéos")
    section_featured_desc_rn = models.TextField(blank=True, default="")

    section_categories_rn = models.CharField(max_length=100, blank=True, default="Jamii")
    section_categories_accent_rn = models.CharField(max_length=100, blank=True, default="")
    section_categories_desc_rn = models.TextField(blank=True, default="Menya amoko yose yo kugira ngo urushirize ubuzima bwawe bw'umwuka")

    section_announcements_badge_rn = models.CharField(max_length=100, blank=True, default="Imitangire")
    section_announcements_title_rn = models.CharField(max_length=200, blank=True, default="Amakuru")
    section_announcements_accent_rn = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_rn = models.TextField(blank=True, default="")

    section_testimonials_badge_rn = models.CharField(max_length=100, blank=True, default="Ivyerekeye")
    section_testimonials_title_rn = models.CharField(max_length=200, blank=True, default="Ico bavuga")
    section_testimonials_accent_rn = models.CharField(max_length=100, blank=True, default="")
    section_testimonials_desc_rn = models.TextField(blank=True, default="")
    
    # English
    hero_badge_en = models.CharField(max_length=150, blank=True, default="ANGELICAN CHURCH OF BURUNDI")
    hero_title_en = models.CharField(max_length=200, blank=True, default="Makamba Diocese")
    hero_subtitle_en = models.TextField(blank=True, default="Serving God and our neighbor in the heart of Makamba.")
    hero_btn1_text_en = models.CharField(max_length=100, blank=True, default="Discover the diocese")
    hero_btn1_link_en = models.CharField(max_length=255, blank=True, default="/diocese")
    hero_btn2_text_en = models.CharField(max_length=100, blank=True, default="Diocese Life")
    hero_btn2_link_en = models.CharField(max_length=255, blank=True, default="/ministeres")
    about_content_en = models.TextField(blank=True, default="")
    about_title_en = models.CharField(max_length=200, blank=True, default="Our Story")
    about_title_accent_en = models.CharField(max_length=200, blank=True, default="& Vision")
    about_badge_en = models.CharField(max_length=100, blank=True, default="About Us")
    contact_content_en = models.TextField(blank=True, default="")
    contact_badge_en = models.CharField(max_length=100, blank=True, default="Contact")
    
    bible_verse_en = models.TextField(blank=True, default="May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit!")
    bible_verse_ref_en = models.CharField(max_length=50, blank=True, default="Romans 15:13")
    
    btn_emissions_en = models.CharField(max_length=100, blank=True, default="Broadcasts")
    btn_teachings_en = models.CharField(max_length=100, blank=True, default="Teachings")
    btn_meditation_en = models.CharField(max_length=100, blank=True, default="Words of Meditation")
    
    stat_emissions_en = models.CharField(max_length=50, blank=True, default="Broadcasts")
    stat_audience_en = models.CharField(max_length=50, blank=True, default="Listeners")
    stat_languages_en = models.CharField(max_length=50, blank=True, default="Languages")
    
    section_featured_en = models.CharField(max_length=100, blank=True, default="Featured Broadcasts")
    section_featured_badge_en = models.CharField(max_length=100, blank=True, default="New Content")
    section_featured_accent_en = models.CharField(max_length=100, blank=True, default="Videos")
    section_featured_desc_en = models.TextField(blank=True, default="Discover our latest productions")

    section_categories_en = models.CharField(max_length=100, blank=True, default="Categories")
    section_categories_accent_en = models.CharField(max_length=100, blank=True, default="Programs")
    section_categories_desc_en = models.TextField(blank=True, default="Explore our different broadcast categories to enrich your spiritual life")

    section_announcements_badge_en = models.CharField(max_length=100, blank=True, default="Announcements")
    section_announcements_title_en = models.CharField(max_length=200, blank=True, default="Info & Events")
    section_announcements_accent_en = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_en = models.TextField(blank=True, default="Stay informed about our ministry activities")

    section_testimonials_badge_en = models.CharField(max_length=100, blank=True, default="Testimonials")
    section_testimonials_title_en = models.CharField(max_length=200, blank=True, default="What people say")
    section_testimonials_accent_en = models.CharField(max_length=100, blank=True, default="about us")
    section_testimonials_desc_en = models.TextField(blank=True, default="Discover how Diocese Makamba transforms lives")
    
    # Swahili
    hero_badge_sw = models.CharField(max_length=150, blank=True, default="KANISA LA ANGLIKANA BURUNDI")
    hero_title_sw = models.CharField(max_length=200, blank=True, default="Jimbo la Makamba")
    hero_subtitle_sw = models.TextField(blank=True, default="Servir Dieu et notre prochain au cœur de Makamba.")
    hero_btn1_text_sw = models.CharField(max_length=100, blank=True, default="Gundua diyosisi")
    hero_btn1_link_sw = models.CharField(max_length=255, blank=True, default="/diocese")
    hero_btn2_text_sw = models.CharField(max_length=100, blank=True, default="Maisha ya diyosisi")
    hero_btn2_link_sw = models.CharField(max_length=255, blank=True, default="/ministeres")
    about_content_sw = models.TextField(blank=True, default="")
    about_title_sw = models.CharField(max_length=200, blank=True, default="Historia yetu")
    about_title_accent_sw = models.CharField(max_length=200, blank=True, default="& Maono")
    about_badge_sw = models.CharField(max_length=100, blank=True, default="Kuhusu Sisi")
    contact_content_sw = models.TextField(blank=True, default="")
    contact_badge_sw = models.CharField(max_length=100, blank=True, default="Wasiliana Nasi")
    
    bible_verse_sw = models.TextField(blank=True, default="Mungu wa matumaini na akujaze furaha yote na amani katika kuamini, ili upate wingi wa matumaini kwa nguvu ya Roho Mtakatifu!")
    bible_verse_ref_sw = models.CharField(max_length=50, blank=True, default="Warumi 15:13")
    
    btn_emissions_sw = models.CharField(max_length=100, blank=True, default="Matangazo")
    btn_teachings_sw = models.CharField(max_length=100, blank=True, default="Mafundisho")
    btn_meditation_sw = models.CharField(max_length=100, blank=True, default="Maneno ya Kutafakari")
    
    stat_emissions_sw = models.CharField(max_length=50, blank=True, default="Matangazo")
    stat_audience_sw = models.CharField(max_length=50, blank=True, default="Wasikilizaji")
    stat_languages_sw = models.CharField(max_length=50, blank=True, default="Lugha")
    
    section_featured_sw = models.CharField(max_length=100, blank=True, default="Matangazo Maalum")
    section_featured_badge_sw = models.CharField(max_length=100, blank=True, default="Mpya")
    section_featured_accent_sw = models.CharField(max_length=100, blank=True, default="Video")
    section_featured_desc_sw = models.TextField(blank=True, default="Gundua kazi zetu za hivi punde")

    section_categories_sw = models.CharField(max_length=100, blank=True, default="Jamii")
    section_categories_accent_sw = models.CharField(max_length=100, blank=True, default="Matangazo")
    section_categories_desc_sw = models.TextField(blank=True, default="Chunguza jamii zetu tofauti za matangazo ili kuimarisha maisha yako ya kiroho")

    section_announcements_badge_sw = models.CharField(max_length=100, blank=True, default="Matangazo")
    section_announcements_title_sw = models.CharField(max_length=200, blank=True, default="Habari na Matukio")
    section_announcements_accent_sw = models.CharField(max_length=100, blank=True, default="")
    section_announcements_desc_sw = models.TextField(blank=True, default="Pata habari kuhusu shughuli za huduma yetu")

    section_testimonials_badge_sw = models.CharField(max_length=100, blank=True, default="Ushuhuda")
    section_testimonials_title_sw = models.CharField(max_length=200, blank=True, default="Wanachosema")
    section_testimonials_accent_sw = models.CharField(max_length=100, blank=True, default="kuhusu sisi")
    section_testimonials_desc_sw = models.TextField(blank=True, default="Gundua jinsi Diocese Makamba inavyobadilisha maisha")
    
    # Champs legacy (pour compatibilité) - pointent vers français
    @property
    def hero_title(self):
        return self.hero_title_fr
    
    @property
    def hero_subtitle(self):
        return self.hero_subtitle_fr
    
    @property
    def about_content(self):
        return self.about_content_fr
    
    @property
    def contact_content(self):
        return self.contact_content_fr
    
    # Personnalisation Header (multilingue)
    # Français
    header_admin_btn_fr = models.CharField(max_length=50, blank=True, default="Connexion Admin", help_text="Texte du bouton admin")
    header_slogan_fr = models.CharField(max_length=200, blank=True, default="", help_text="Slogan dans le header")
    # Kirundi
    header_admin_btn_rn = models.CharField(max_length=50, blank=True, default="Injira Admin")
    header_slogan_rn = models.CharField(max_length=200, blank=True, default="")
    # English
    header_admin_btn_en = models.CharField(max_length=50, blank=True, default="Admin Login")
    header_slogan_en = models.CharField(max_length=200, blank=True, default="")
    # Swahili
    header_admin_btn_sw = models.CharField(max_length=50, blank=True, default="Ingia Admin")
    header_slogan_sw = models.CharField(max_length=200, blank=True, default="")
    
    # Options Header
    show_admin_button = models.BooleanField(default=True, help_text="Afficher le bouton admin dans le header")
    
    # Personnalisation Footer (multilingue)
    # Français
    footer_description_fr = models.TextField(blank=True, default="Un ministère chrétien centré sur la guérison intérieure, la méditation de la Parole de Dieu, l'enseignement biblique et la croissance personnelle.")
    footer_quick_links_title_fr = models.CharField(max_length=100, blank=True, default="Liens rapides")
    footer_contact_title_fr = models.CharField(max_length=100, blank=True, default="Contactez-nous")
    footer_social_title_fr = models.CharField(max_length=100, blank=True, default="Suivez-nous")
    footer_copyright_fr = models.CharField(max_length=200, blank=True, default="Tous droits réservés")
    # Kirundi
    footer_description_rn = models.TextField(blank=True, default="Umurimo w'amadini wo gukira mu mutima, gutekereza Ijambo ry'Imana, inyigisho za Bibiliya no gukura.")
    footer_quick_links_title_rn = models.CharField(max_length=100, blank=True, default="Amahuza")
    footer_contact_title_rn = models.CharField(max_length=100, blank=True, default="Twandikire")
    footer_social_title_rn = models.CharField(max_length=100, blank=True, default="Dukurikire")
    footer_copyright_rn = models.CharField(max_length=200, blank=True, default="Uburenganzira bwose")
    # English
    footer_description_en = models.TextField(blank=True, default="A Christian ministry focused on inner healing, meditation on God's Word, biblical teaching and personal growth.")
    footer_quick_links_title_en = models.CharField(max_length=100, blank=True, default="Quick Links")
    footer_contact_title_en = models.CharField(max_length=100, blank=True, default="Contact Us")
    footer_social_title_en = models.CharField(max_length=100, blank=True, default="Follow Us")
    footer_copyright_en = models.CharField(max_length=200, blank=True, default="All rights reserved")
    # Swahili
    footer_description_sw = models.TextField(blank=True, default="Huduma ya Kikristo inayolenga uponyaji wa ndani, kutafakari Neno la Mungu, mafundisho ya Biblia na ukuaji binafsi.")
    footer_quick_links_title_sw = models.CharField(max_length=100, blank=True, default="Viungo vya Haraka")
    footer_contact_title_sw = models.CharField(max_length=100, blank=True, default="Wasiliana Nasi")
    footer_social_title_sw = models.CharField(max_length=100, blank=True, default="Tufuate")
    footer_copyright_sw = models.CharField(max_length=200, blank=True, default="Haki zote zimehifadhiwa")
    
    # Personnalisation des titres de pages (multilingue)
    # Français
    page_courses_title_fr = models.CharField(max_length=200, blank=True, default="Toutes les émissions", help_text="Titre de la page des émissions")
    page_about_title_fr = models.CharField(max_length=200, blank=True, default="À propos", help_text="Titre de la page À propos")
    page_contact_title_fr = models.CharField(max_length=200, blank=True, default="Contactez-nous", help_text="Titre de la page Contact")
    # Kirundi
    page_courses_title_rn = models.CharField(max_length=200, blank=True, default="Imitangire yose")
    page_about_title_rn = models.CharField(max_length=200, blank=True, default="Ibyerekeye")
    page_contact_title_rn = models.CharField(max_length=200, blank=True, default="Twandikire")
    # English
    page_courses_title_en = models.CharField(max_length=200, blank=True, default="All Courses")
    page_about_title_en = models.CharField(max_length=200, blank=True, default="About")
    page_contact_title_en = models.CharField(max_length=200, blank=True, default="Contact Us")
    # Swahili
    page_courses_title_sw = models.CharField(max_length=200, blank=True, default="Matangazo Yote")
    page_about_title_sw = models.CharField(max_length=200, blank=True, default="Kuhusu")
    page_contact_title_sw = models.CharField(max_length=200, blank=True, default="Wasiliana Nasi")
    
    # Personnalisation des styles
    # Couleurs
    primary_color = models.CharField(max_length=7, blank=True, default="#3B82F6", help_text="Couleur principale (hex: #RRGGBB)")
    secondary_color = models.CharField(max_length=7, blank=True, default="#10B981", help_text="Couleur secondaire")
    text_color = models.CharField(max_length=7, blank=True, default="#1F2937", help_text="Couleur du texte principal")
    background_color = models.CharField(max_length=7, blank=True, default="#FFFFFF", help_text="Couleur de fond")
    accent_color = models.CharField(max_length=7, blank=True, default="#8B5CF6", help_text="Couleur d'accentuation")
    
    # Polices (fonts)
    heading_font = models.CharField(max_length=100, blank=True, default="Playfair Display", help_text="Police pour les titres")
    body_font = models.CharField(max_length=100, blank=True, default="Inter", help_text="Police pour le corps de texte")
    
    # Tailles de texte (en pixels ou rem)
    heading_size = models.CharField(max_length=10, blank=True, default="2.5rem", help_text="Taille des titres principaux")
    subheading_size = models.CharField(max_length=10, blank=True, default="1.5rem", help_text="Taille des sous-titres")
    body_size = models.CharField(max_length=10, blank=True, default="1rem", help_text="Taille du texte normal")
    small_size = models.CharField(max_length=10, blank=True, default="0.875rem", help_text="Taille du petit texte")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Paramètres du site"
        verbose_name_plural = "Paramètres du site"
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Paramètres - {self.site_name}"
    
    def save(self, *args, **kwargs):
        # Toujours une seule instance
        self.pk = 1
        super().save(*args, **kwargs)
        # Invalider le cache
        cache.delete('site_settings')
    
    @classmethod
    def get_settings(cls):
        """Récupère les paramètres (avec cache)"""
        try:
            settings = cache.get('site_settings')
            if settings is None:
                try:
                    settings, _ = cls.objects.get_or_create(pk=1)
                    cache.set('site_settings', settings, 3600)  # Cache 1 heure
                except Exception as e:
                    # Si get_or_create échoue, essayer de récupérer directement
                    try:
                        settings = cls.objects.get(pk=1)
                        cache.set('site_settings', settings, 3600)
                    except cls.DoesNotExist:
                        # Si l'instance n'existe pas, créer avec valeurs par défaut
                        settings = cls.objects.create(
                            pk=1,
                            site_name='Diocese Makamba',
                            description='Site officiel du Diocese Makamba Connect',
                            contact_email='info@makamba-diocese.org',
                            contact_phone='+257 22 23 45 67',
                            contact_address='Makamba, Burundi',
                            stat_audience_value='8K',
                            stat_languages_value='15',
                        )
                        cache.set('site_settings', settings, 3600)
            return settings
        except Exception as e:
            # En cas d'erreur, essayer de récupérer ou créer sans cache
            try:
                return cls.objects.get(pk=1)
            except cls.DoesNotExist:
                return cls.objects.create(pk=1, site_name="Diocese Makamba", contact_email="info@makamba-diocese.org")

