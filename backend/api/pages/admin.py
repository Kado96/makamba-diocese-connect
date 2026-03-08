from django.contrib import admin
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember

@admin.register(TimelineEvent)
class TimelineEventAdmin(admin.ModelAdmin):
    list_display = ('year', 'title', 'order', 'image')
    list_editable = ('order',)
    search_fields = ('year', 'title', 'description')

@admin.register(MissionAxe)
class MissionAxeAdmin(admin.ModelAdmin):
    list_display = ('text', 'order')
    list_editable = ('order',)

@admin.register(VisionValue)
class VisionValueAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    list_editable = ('order',)

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'order', 'image')
    list_editable = ('order',)

from .models import DiocesePresentation
@admin.register(DiocesePresentation)
class DiocesePresentationAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        # Allow adding if there is no presentation yet
        if DiocesePresentation.objects.exists():
            return False
        return super().has_add_permission(request)
