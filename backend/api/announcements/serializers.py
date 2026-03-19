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

    class Meta:
        model = Announcement
        fields = '__all__'

    def get_image_display(self, obj):
        return obj.image.url if obj.image else None
