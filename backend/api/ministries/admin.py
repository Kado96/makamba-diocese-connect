from django.contrib import admin
from .models import Ministry, MinistryActivity, MinistryPage

class MinistryActivityInline(admin.TabularInline):
    model = MinistryActivity
    extra = 3
    fields = ('title_fr', 'title_rn', 'title_en', 'title_sw')

@admin.register(MinistryPage)
class MinistryPageAdmin(admin.ModelAdmin):
    list_display = ('id', 'hero_title_fr', 'hero_badge_fr')

@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'icon', 'order')
    inlines = [MinistryActivityInline]

@admin.register(MinistryActivity)
class MinistryActivityAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'ministry')
    list_filter = ('ministry',)
