import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from api.sermons.models import Sermon, SermonCategory
from api.announcements.models import Announcement
from api.parishes.models import Parish
from api.ministries.models import Ministry, MinistryActivity
from api.pages.models import TimelineEvent, MissionAxe, VisionValue, TeamMember
from api.settings.models import SiteSettings

class Command(BaseCommand):
    help = 'Clean legacy Shalom Ministry data and reset to Makamba Diocese defaults'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Starting full legacy data cleanup...'))

        # 1. Clear Data models
        self.stdout.write('Clearing sermons and announcements...')
        Sermon.objects.all().delete()
        SermonCategory.objects.all().delete()
        Announcement.objects.all().delete()

        self.stdout.write('Clearing parishes and ministries...')
        Parish.objects.all().delete()
        MinistryActivity.objects.all().delete()
        Ministry.objects.all().delete()

        self.stdout.write('Clearing diocese pages content...')
        TimelineEvent.objects.all().delete()
        MissionAxe.objects.all().delete()
        VisionValue.objects.all().delete()
        TeamMember.objects.all().delete()

        # 2. Reset Settings
        self.stdout.write('Resetting Site Settings...')
        SiteSettings.objects.all().delete()
        SiteSettings.objects.create(
            pk=1,
            site_name="Diocèse Anglicane de Makamba",
            description="Site officiel du Diocèse Anglicane de Makamba Connect",
            contact_email="info@makamba-diocese.org",
            contact_phone="+257 22 23 45 67",
            contact_address="Makamba, Burundi",
            hero_title_fr="Grandissez dans la foi",
            hero_subtitle_fr="Bienvenue sur le portail numérique du Diocèse de Makamba.",
            about_title_fr="Notre Diocèse",
            about_content_fr="L'Église Anglicane du Diocèse de Makamba est engagée pour la transformation spirituelle et sociale."
        )

        # 3. Clean Media directory
        media_root = settings.MEDIA_ROOT
        if os.path.exists(media_root):
            self.stdout.write(f'Cleaning media directory: {media_root}')
            for filename in os.listdir(media_root):
                file_path = os.path.join(media_root, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to delete {file_path}. Reason: {e}'))

        self.stdout.write(self.style.SUCCESS('Cleanup complete! Makamba Diocese Connect is now fresh.'))
