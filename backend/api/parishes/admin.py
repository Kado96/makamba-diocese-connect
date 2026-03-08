from django.contrib import admin
from .models import Parish

@admin.register(Parish)
class ParishAdmin(admin.ModelAdmin):
    list_display = ('name', 'zone', 'faithful', 'pastor', 'image')
    search_fields = ('name', 'zone', 'pastor')
    list_filter = ('zone',)
