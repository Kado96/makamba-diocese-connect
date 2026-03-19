from django.contrib import admin
from .models import Announcement, AnnouncementImage

class AnnouncementImageInline(admin.TabularInline):
    model = AnnouncementImage
    extra = 3

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'category', 'priority', 'event_date', 'is_active')
    list_filter = ('category', 'priority', 'is_active', 'event_date')
    search_fields = ('title_fr', 'title_en', 'content_fr', 'content_en')
    inlines = [AnnouncementImageInline]
    fieldsets = (
        ('Français', {
            'fields': ('title_fr', 'content_fr')
        }),
        ('English', {
            'fields': ('title_en', 'content_en')
        }),
        ('Configuration', {
            'fields': ('category', 'priority', 'event_date', 'image', 'is_active'),
        }),
        ('Migration (Obsolète)', {
            'classes': ('collapse',),
            'fields': ('title', 'content', 'language'),
        }),
    )
