from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify


class SermonCategory(models.Model):
    id = models.BigAutoField(primary_key=True)
    name_fr = models.CharField(max_length=100, verbose_name="Nom (FR)", default="Catégorie")
    name_en = models.CharField(max_length=100, verbose_name="Nom (EN)", blank=True, null=True)
    
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    
    description_fr = models.TextField(blank=True, verbose_name="Description (FR)")
    description_en = models.TextField(blank=True, verbose_name="Description (EN)")
    
    icon = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Champs obsolètes (pour migration)
    name = models.CharField(max_length=100, blank=True, null=True, help_text="OBSOLÈTE: Utiliser name_fr/en")
    description = models.TextField(blank=True, null=True, help_text="OBSOLÈTE: Utiliser description_fr/en")

    class Meta:
        ordering = ["name_fr"]
        verbose_name_plural = "Sermon categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_fr or self.name or "category")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_fr or self.name or "Sermon Category"


class Sermon(models.Model):
    # Langues autorisées pour le MEDIA lui-même (facultatif si bilingue)
    LANGUAGE_CHOICES = (
        ("fr", "Français"),
        ("en", "English"),
    )

    CONTENT_TYPE_CHOICES = (
        ("video", "Vidéo"),
        ("audio", "Audio"),
        ("youtube", "YouTube"),
        ("document", "Document"),
    )

    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey(
        SermonCategory,
        on_delete=models.SET_NULL,
        null=True,
        related_name="sermons",
    )
    content_type = models.CharField(
        max_length=10, choices=CONTENT_TYPE_CHOICES, default="video"
    )
    
    title_fr = models.CharField(max_length=200, verbose_name="Titre (FR)", default="Sermon")
    title_en = models.CharField(max_length=200, verbose_name="Titre (EN)", blank=True, null=True)
    
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    
    description_fr = models.TextField(verbose_name="Description (FR)")
    description_en = models.TextField(verbose_name="Description (EN)", blank=True, null=True)
    
    preacher_name = models.CharField(max_length=120)
    
    # Langue du contenu principal (choix restreint)
    language_primary = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="fr", verbose_name="Langue du média")
    
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    video_url = models.URLField(blank=True, help_text="URL YouTube ou lien direct")
    video_file = models.FileField(
        upload_to="sermons/videos/",
        null=True,
        blank=True,
        help_text="Ou télécharger un fichier vidéo",
    )
    audio_url = models.URLField(blank=True, help_text="URL audio")
    audio_file = models.FileField(
        upload_to="sermons/audio/",
        null=True,
        blank=True,
        help_text="Ou télécharger un fichier audio",
    )
    document_file = models.FileField(
        upload_to="sermons/documents/",
        null=True,
        blank=True,
        help_text="Ou télécharger un document (PDF, Word, etc.)",
    )
    image = models.ImageField(upload_to="sermons/", null=True, blank=True)
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    sermon_date = models.DateField(auto_now=False, null=True, blank=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Champs obsolètes (pour migration)
    title = models.CharField(max_length=200, blank=True, null=True, help_text="OBSOLÈTE: Utiliser title_fr/en")
    description = models.TextField(blank=True, null=True, help_text="OBSOLÈTE: Utiliser description_fr/en")
    language = models.CharField(max_length=2, blank=True, null=True, help_text="OBSOLÈTE: Utiliser language_primary")

    class Meta:
        ordering = ["-sermon_date", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_fr or self.title or "sermon")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title_fr or self.title or "Sermon"
