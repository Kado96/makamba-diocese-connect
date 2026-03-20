from rest_framework import serializers
from .models import TimelineEvent, MissionAxe, VisionValue, TeamMember, DiocesePresentation

class TimelineEventSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = TimelineEvent
        fields = '__all__'

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class MissionAxeSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = MissionAxe
        fields = '__all__'

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class VisionValueSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = VisionValue
        fields = '__all__'

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class TeamMemberSerializer(serializers.ModelSerializer):
    image_display = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = '__all__'

    def get_image_display(self, obj):
        return self._get_image_url(obj, 'image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None

class DiocesePresentationSerializer(serializers.ModelSerializer):
    hero_image_display = serializers.SerializerMethodField()
    history_image_display = serializers.SerializerMethodField()
    bishop_photo_display = serializers.SerializerMethodField()
    
    # Virtual localized fields
    history_title = serializers.SerializerMethodField()
    history_text = serializers.SerializerMethodField()
    bishop_message = serializers.SerializerMethodField()
    organization_text = serializers.SerializerMethodField()

    vision_image_display = serializers.SerializerMethodField()
    mission_image_display = serializers.SerializerMethodField()
    values_image_display = serializers.SerializerMethodField()

    class Meta:
        model = DiocesePresentation
        fields = [
            'id', 'hero_image', 'history_image', 'bishop_photo', 'vision_image', 'mission_image', 'values_image',
            'hero_image_display', 'history_image_display', 'bishop_photo_display', 'vision_image_display', 'mission_image_display', 'values_image_display',
            'bishop_name', 'history_title', 'history_text', 'bishop_message', 'organization_text',
            # Raw localized fields
            'hero_subtitle_fr', 'hero_subtitle_rn', 'hero_subtitle_en', 'hero_subtitle_sw',
            'history_title_fr', 'history_title_rn', 'history_title_en', 'history_title_sw',
            'history_text_fr', 'history_text_rn', 'history_text_en', 'history_text_sw',
            'bishop_message_fr', 'bishop_message_rn', 'bishop_message_en', 'bishop_message_sw',
            'organization_text_fr', 'organization_text_rn', 'organization_text_en', 'organization_text_sw',
            # Vision
            'vision_title_fr', 'vision_title_rn', 'vision_title_en', 'vision_title_sw',
            'vision_description_fr', 'vision_description_rn', 'vision_description_en', 'vision_description_sw',
            # Mission
            'mission_title_fr', 'mission_title_rn', 'mission_title_en', 'mission_title_sw',
            'mission_description_fr', 'mission_description_rn', 'mission_description_en', 'mission_description_sw',
            # Values Intro
            'values_title_fr', 'values_title_rn', 'values_title_en', 'values_title_sw',
            'values_description_fr', 'values_description_rn', 'values_description_en', 'values_description_sw',
            # Team Intro
            'team_badge_fr', 'team_badge_rn', 'team_badge_en', 'team_badge_sw',
            'team_title_fr', 'team_title_rn', 'team_title_en', 'team_title_sw',
            'team_description_fr', 'team_description_rn', 'team_description_en', 'team_description_sw',
            # Organization
            'organization_title_fr', 'organization_title_rn', 'organization_title_en', 'organization_title_sw',
            'organization_subtitle_fr', 'organization_subtitle_rn', 'organization_subtitle_en', 'organization_subtitle_sw',
            # Section Badges
            'vision_badge_fr', 'vision_badge_rn', 'vision_badge_en', 'vision_badge_sw',
            'mission_badge_fr', 'mission_badge_rn', 'mission_badge_en', 'mission_badge_sw',
            'values_badge_fr', 'values_badge_rn', 'values_badge_en', 'values_badge_sw',
            # Bishop Title
            'bishop_title_fr', 'bishop_title_rn', 'bishop_title_en', 'bishop_title_sw',
            'hero_title_fr', 'hero_title_rn', 'hero_title_en', 'hero_title_sw',
            'nav_history_fr', 'nav_history_rn', 'nav_history_en', 'nav_history_sw',
            'nav_bishop_fr', 'nav_bishop_rn', 'nav_bishop_en', 'nav_bishop_sw',
            'nav_vision_fr', 'nav_vision_rn', 'nav_vision_en', 'nav_vision_sw',
            'nav_team_fr', 'nav_team_rn', 'nav_team_en', 'nav_team_sw',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

    def get_history_title(self, obj):
        lang = self._get_lang()
        val = getattr(obj, f'history_title_{lang}', None)
        return val if val else obj.history_title_fr

    def get_history_text(self, obj):
        lang = self._get_lang()
        val = getattr(obj, f'history_text_{lang}', None)
        return val if val else obj.history_text_fr

    def get_bishop_message(self, obj):
        lang = self._get_lang()
        val = getattr(obj, f'bishop_message_{lang}', None)
        return val if val else obj.bishop_message_fr

    def get_organization_text(self, obj):
        lang = self._get_lang()
        val = getattr(obj, f'organization_text_{lang}', None)
        return val if val else obj.organization_text_fr

    def get_hero_image_display(self, obj):
        return self._get_image_url(obj, 'hero_image')

    def get_history_image_display(self, obj):
        return self._get_image_url(obj, 'history_image')
        
    def get_bishop_photo_display(self, obj):
        return self._get_image_url(obj, 'bishop_photo')

    def get_vision_image_display(self, obj):
        return self._get_image_url(obj, 'vision_image')

    def get_mission_image_display(self, obj):
        return self._get_image_url(obj, 'mission_image')

    def get_values_image_display(self, obj):
        return self._get_image_url(obj, 'values_image')

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            return image_field.url
        except Exception:
            return None
