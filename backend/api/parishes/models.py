from django.db import models

class Parish(models.Model):
    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Kiswahili'),
    ]

    name = models.CharField(max_length=255, verbose_name="Nom de la paroisse")
    zone = models.CharField(max_length=100, verbose_name="Zone / Commune")
    faithful = models.CharField(max_length=50, blank=True, verbose_name="Nombre de fidèles")
    pastor = models.CharField(max_length=255, verbose_name="Nom du Pasteur")
    phone = models.CharField(max_length=50, blank=True, verbose_name="Numéro de téléphone")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    image = models.ImageField(upload_to='parishes/', blank=True, null=True, verbose_name="Photo de la paroisse")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Paroisse"
        verbose_name_plural = "Paroisses"
        ordering = ['name']
