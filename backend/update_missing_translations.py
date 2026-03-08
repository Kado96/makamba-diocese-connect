
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.settings.models import SiteSettings

def update_missing_translations():
    settings = SiteSettings.get_settings()
    
    # Vision English
    if not settings.vision_description_en: settings.vision_description_en = "Rooted in the Gospel, the Diocese of Makamba is committed to serving God and communities through three fundamental pillars."
    if not settings.vision_pillar1_desc_en: settings.vision_pillar1_desc_en = "A rich sacramental life, rooted in Anglican liturgy and daily community prayer."
    if not settings.vision_pillar2_desc_en: settings.vision_pillar2_desc_en = "Parishes close to communities, with dedicated teams from the local Makamba area."
    if not settings.vision_pillar3_desc_en: settings.vision_pillar3_desc_en = "Education, health and community development: concrete action to transform lives."

    # Engage English
    if not settings.engage_description_en: settings.engage_description_en = "Everyone has a role to play in the mission of our Church"
    if not settings.engage_item1_desc_en: settings.engage_item1_desc_en = "Youth, women, education… Find your place in the life of the diocese."
    if not settings.engage_item2_desc_en: settings.engage_item2_desc_en = "Participate in funding our education, health, and development projects."
    if not settings.engage_item3_desc_en: settings.engage_item3_desc_en = "Join our prayer groups, spiritual retreats, and celebrations."

    # Kirundi
    if not settings.vision_description_rn: settings.vision_description_rn = "Diyoseze ya Makamba ishingiye ku Njili, yiyemeje gukorera Imana n'abanyagihugu biciye mu nkingi zitatu zishinze."
    if not settings.vision_pillar1_desc_rn: settings.vision_pillar1_desc_rn = "Ubuzima bw'amasakaramentu butunze, bushingiye kuri liturujiya ya Anglikana n'isengesho ry'ishengero rya buri musi."
    if not settings.vision_pillar2_desc_rn: settings.vision_pillar2_desc_rn = "Ibishengero biri hafi y'abanyagihugu, birimwo imirwi ikuye amaboko mu mufuko ikomoka mu ntara ya Makamba."
    if not settings.vision_pillar3_desc_rn: settings.vision_pillar3_desc_rn = "Inyigisho, amagara y'abantu n'iterambere ry'abanyagihugu: gukora ibintu biboneka kugira ngo ubuzima bwahinduke."

    # Swahili
    if not settings.vision_description_sw: settings.vision_description_sw = "Likizikwa katika Injili, Jimbo la Makamba limejitolea kumtumikia Mungu na jamii kupitia nguzo tatu za msingi."
    if not settings.vision_pillar1_desc_sw: settings.vision_pillar1_desc_sw = "Maisha tajiri ya kisakramenti, yaliyozikwa katika liturujia ya Kianglikana na sala ya kila siku ya jamii."
    if not settings.vision_pillar2_desc_sw: settings.vision_pillar2_desc_sw = "Parokia zilizo karibu na jamii, zikiwa na timu zilizojitolea kutoka eneo la Makamba."
    if not settings.vision_pillar3_desc_sw: settings.vision_pillar3_desc_sw = "Elimu, afya na maendeleo ya jamii: kuchukua hatua thabiti kubadilisha maisha."

    settings.save()
    print("✅ Descriptions multilingues mises à jour avec succès.")

if __name__ == "__main__":
    update_missing_translations()
