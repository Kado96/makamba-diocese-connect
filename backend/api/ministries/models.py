from django.db import models

class Ministry(models.Model):
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Kiswahili'),
    ]

    title = models.CharField(max_length=255, verbose_name="Titre du ministère")
    mission = models.TextField(verbose_name="Mission / Description")
    icon = models.CharField(max_length=50, default="Users", help_text="Nom de l'icône Lucide (ex: Users, Heart, BookOpen, Sprout)")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    
    testimony_quote = models.TextField(blank=True, verbose_name="Citation du témoignage")
    testimony_author = models.CharField(max_length=255, blank=True, verbose_name="Auteur du témoignage")
    image = models.ImageField(upload_to='ministries/', blank=True, null=True, verbose_name="Image illustrative")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Ministère"
        verbose_name_plural = "Ministères"

class MinistryActivity(models.Model):
    ministry = models.ForeignKey(Ministry, related_name='activities', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="Titre de l'activité")
    
    def __str__(self):
        return f"{self.ministry.title} - {self.title}"
    
    class Meta:
        verbose_name = "Activité de ministère"
        verbose_name_plural = "Activités de ministère"
