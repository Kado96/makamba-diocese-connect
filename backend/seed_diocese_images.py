import os
import sys
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'makamba.settings')
django.setup()

from api.pages.models import DiocesePresentation, MissionAxe, VisionValue, TeamMember, TimelineEvent

def download_image(url, filename):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        print(f"Downloaded {filename}")
        return ContentFile(response.content, name=filename)
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None

def seed_diocese_images():
    print("Seeding diocese images...")
    
    # 1. Diocese Presentation
    presentation, _ = DiocesePresentation.objects.get_or_create()
    
    # Hero image
    if not presentation.hero_image:
        print("Adding hero image...")
        img = download_image("https://images.unsplash.com/photo-1548625361-9f939222c0e8?q=80&w=2000&auto=format&fit=crop", "hero_diocese.jpg")
        if img: presentation.hero_image.save("hero_diocese.jpg", img, save=False)
        
    if not presentation.history_image:
        print("Adding history image...")
        img = download_image("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop", "history_church.jpg")
        if img: presentation.history_image.save("history_church.jpg", img, save=False)
        
    if not presentation.bishop_photo:
        print("Adding bishop photo...")
        img = download_image("https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop", "bishop_photo.jpg")
        if img: presentation.bishop_photo.save("bishop_photo.jpg", img, save=False)
        
    presentation.save()

    # 2. Vision Values
    values_data = [
        {"title": "Amour & Compassion", "url": "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop"},
        {"title": "Intégrité", "url": "https://images.unsplash.com/photo-1504430588673-8b7762cc6297?q=80&w=800&auto=format&fit=crop"},
        {"title": "Service & Dévouement", "url": "https://images.unsplash.com/photo-1593113580340-e0ced9820f4c?q=80&w=800&auto=format&fit=crop"},
        {"title": "Communion & Unité", "url": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop"}
    ]
    
    values = VisionValue.objects.all()
    for i, val in enumerate(values):
        if not val.image and i < len(values_data):
            img = download_image(values_data[i]["url"], f"value_{i}.jpg")
            if img:
                val.image.save(f"value_{i}.jpg", img, save=True)

    # 3. Mission Axes
    axes_data = [
        "https://images.unsplash.com/photo-1438032005730-c779502fac39?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490730141103-6cac27fcab94?q=80&w=800&auto=format&fit=crop"
    ]
    axes = MissionAxe.objects.all()
    for i, axe in enumerate(axes):
        if not axe.image and i < len(axes_data):
            img = download_image(axes_data[i], f"axe_{i}.jpg")
            if img:
                axe.image.save(f"axe_{i}.jpg", img, save=True)

    # 4. Timeline Events
    timeline_data = [
        "https://images.unsplash.com/photo-1548622152-ed4f3d2f34aa?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?q=80&w=800&auto=format&fit=crop"
    ]
    events = TimelineEvent.objects.all()
    for i, event in enumerate(events):
        if not event.image and i < len(timeline_data):
            img = download_image(timeline_data[i], f"timeline_{i}.jpg")
            if img:
                event.image.save(f"timeline_{i}.jpg", img, save=True)
                
    # 5. Team
    print("Done seeding diocese images.")

if __name__ == "__main__":
    seed_diocese_images()
