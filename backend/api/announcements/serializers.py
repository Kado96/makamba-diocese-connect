from rest_framework import serializers
from .models import Announcement, AnnouncementImage

class AnnouncementImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AnnouncementImage
        fields = ['id', 'image', 'image_url', 'caption', 'order']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

class AnnouncementSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    gallery = AnnouncementImageSerializer(many=True, read_only=True)
    
    # Champs dynamiques pour la traduction
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'title_fr', 'title_en', 'content_fr', 'content_en',
            'category', 'category_display', 'priority', 'event_date', 'image', 'image_display',
            'is_active', 'created_at', 'updated_at', 'gallery'
        ]

    def get_image_display(self, obj):
        return obj.image.url if obj.image else None

    def get_title(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.title_en:
            return obj.title_en
        return obj.title_fr or obj.title

    def get_content(self, obj):
        lang = self.context.get('request').query_params.get('language', 'fr') if self.context.get('request') else 'fr'
        if lang == 'en' and obj.content_en:
            return obj.content_en
        return obj.content_fr or obj.content
