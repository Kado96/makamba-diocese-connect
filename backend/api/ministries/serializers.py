from rest_framework import serializers
from .models import Ministry, MinistryActivity

class MinistryActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MinistryActivity
        fields = ['id', 'title']

class MinistrySerializer(serializers.ModelSerializer):
    activities = MinistryActivitySerializer(many=True, read_only=True)
    image_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Ministry
        fields = ['id', 'title', 'mission', 'icon', 'language', 'testimony_quote', 'testimony_author', 'image', 'image_display', 'activities']

    def get_image_display(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url
