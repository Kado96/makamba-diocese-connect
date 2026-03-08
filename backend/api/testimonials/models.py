from django.db import models

class Testimonial(models.Model):
    STATUS_CHOICES = (
        ('published', 'Publié'),
        ('pending', 'En attente'),
        ('archived', 'Archivé'),
    )
    
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Kiswahili'),
    ]
    
    author_name = models.CharField(max_length=255, verbose_name="Auteur")
    author_title = models.CharField(max_length=255, blank=True, null=True, verbose_name="Titre/Rôle")
    content = models.TextField(verbose_name="Contenu")
    rating = models.IntegerField(default=5)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Témoignage de {self.author_name} ({self.language})"

    class Meta:
        ordering = ['-created_at']
