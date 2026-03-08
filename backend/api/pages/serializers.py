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
            url = image_field.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
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
            url = image_field.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
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
            url = image_field.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
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
            url = image_field.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            return None

class DiocesePresentationSerializer(serializers.ModelSerializer):
    hero_image_display = serializers.SerializerMethodField()
    history_image_display = serializers.SerializerMethodField()
    bishop_photo_display = serializers.SerializerMethodField()
    
    # Virtual localized fields
    history_text = serializers.SerializerMethodField()
    bishop_message = serializers.SerializerMethodField()
    organization_text = serializers.SerializerMethodField()

    class Meta:
        model = DiocesePresentation
        fields = [
            'id', 'hero_image_display', 'history_image_display', 'bishop_photo_display',
            'bishop_name', 'history_text', 'bishop_message', 'organization_text',
            # Include raw fields just in case
            'history_text_fr', 'history_text_rn', 'history_text_en', 'history_text_sw',
            'bishop_message_fr', 'bishop_message_rn', 'bishop_message_en', 'bishop_message_sw',
            'organization_text_fr', 'organization_text_rn', 'organization_text_en', 'organization_text_sw',
        ]

    def _get_lang(self):
        request = self.context.get('request')
        if request:
            return request.query_params.get('lang') or request.query_params.get('language') or 'fr'
        return 'fr'

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

    def _get_image_url(self, obj, field_name):
        if not obj:
            return None
        image_field = getattr(obj, field_name, None)
        if not image_field or not hasattr(image_field, 'url'):
            return None
        try:
            url = image_field.url
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
            return url
        except Exception:
            return None
