from django.contrib import admin
from .models import Ministry, MinistryActivity

class MinistryActivityInline(admin.TabularInline):
    model = MinistryActivity
    extra = 3

@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'image')
    inlines = [MinistryActivityInline]

@admin.register(MinistryActivity)
class MinistryActivityAdmin(admin.ModelAdmin):
    list_display = ('title', 'ministry')
    list_filter = ('ministry',)
