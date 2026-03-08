from rest_framework import serializers
from .models import SermonCategory, Sermon


class SermonCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonCategory
        fields = ("id", "name", "slug", "description", "icon")


class SermonListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "content_type",
            "slug",
            "description",
            "preacher_name",
            "category",
            "category_name",
            "language",
            "image",
            "image_url",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "featured",
            "is_active",
            "sermon_date",
            "duration_minutes",
            "views_count",
        )

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)


class SermonDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "preacher_name",
            "category",
            "category_name",
            "language",
            "duration_minutes",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "image",
            "image_url",
            "featured",
            "is_active",
            "sermon_date",
            "views_count",
            "created_at",
            "updated_at",
        )

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)


class AdminSermonSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_display_url = serializers.SerializerMethodField()
    video_display_url = serializers.SerializerMethodField()
    document_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Sermon
        fields = (
            "id",
            "title",
            "slug",
            "description",
            "preacher_name",
            "category",
            "category_name",
            "language",
            "duration_minutes",
            "video_url",
            "video_file",
            "video_display_url",
            "audio_url",
            "audio_file",
            "audio_display_url",
            "document_file",
            "document_display_url",
            "image",
            "image_url",
            "featured",
            "is_active",
            "sermon_date",
            "views_count",
            "created_at",
            "updated_at",
        )

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get("request")
        url = file_field.url
        if request:
            return request.build_absolute_uri(url)
        return url

    def get_image_url(self, obj):
        return self._get_absolute_url(obj.image)

    def get_audio_display_url(self, obj):
        if obj.audio_url:
            return obj.audio_url
        return self._get_absolute_url(obj.audio_file)

    def get_video_display_url(self, obj):
        if obj.video_url:
            return obj.video_url
        return self._get_absolute_url(obj.video_file)

    def get_document_display_url(self, obj):
        return self._get_absolute_url(obj.document_file)
