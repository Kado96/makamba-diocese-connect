from rest_framework import serializers
from .models import Ministry, MinistryActivity, MinistryPage

class MinistryPageSerializer(serializers.ModelSerializer):
    hero_image_display = serializers.SerializerMethodField()
    
    class Meta:
        model = MinistryPage
        fields = [
            'id', 'hero_image', 'hero_image_display',
            'hero_badge_fr', 'hero_badge_rn', 'hero_badge_en', 'hero_badge_sw',
            'hero_title_fr', 'hero_title_rn', 'hero_title_en', 'hero_title_sw',
            'hero_description_fr', 'hero_description_rn', 'hero_description_en', 'hero_description_sw',
        ]

    def get_hero_image_display(self, obj):
        if not obj.hero_image: return None
        request = self.context.get('request')
        if request: return request.build_absolute_uri(obj.hero_image.url)
        return obj.hero_image.url

class MinistryActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MinistryActivity
        fields = ['id', 'title_fr', 'title_rn', 'title_en', 'title_sw']

class MinistrySerializer(serializers.ModelSerializer):
    activities = MinistryActivitySerializer(many=True, read_only=True)
    image_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Ministry
        fields = [
            'id', 'title_fr', 'title_rn', 'title_en', 'title_sw',
            'mission_fr', 'mission_rn', 'mission_en', 'mission_sw',
            'icon', 'testimony_author', 'image', 'image_display', 'activities',
            'testimony_quote_fr', 'testimony_quote_rn', 'testimony_quote_en', 'testimony_quote_sw',
            'order'
        ]

    def get_image_display(self, obj):
        if not obj.image: return None
        request = self.context.get('request')
        if request: return request.build_absolute_uri(obj.image.url)
        return obj.image.url
