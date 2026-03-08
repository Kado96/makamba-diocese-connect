from django.contrib import admin
from .models import Announcement, AnnouncementImage

class AnnouncementImageInline(admin.TabularInline):
    model = AnnouncementImage
    extra = 3

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'event_date', 'is_active', 'language')
    list_filter = ('language', 'category', 'priority', 'is_active', 'event_date')
    search_fields = ('title', 'content')
    inlines = [AnnouncementImageInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'language', 'category', 'content', 'is_active')
        }),
        ('Planification & Visuels', {
            'fields': ('priority', 'event_date', 'image'),
        }),
    )
