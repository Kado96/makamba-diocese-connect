from django.db import models

class TimelineEvent(models.Model):
    LANGUAGE_CHOICES = (
        ("fr", "Français"),
        ("rn", "Kirundi"),
        ("en", "English"),
        ("sw", "Kiswahili"),
    )
    year = models.CharField(max_length=50, verbose_name="Année / Période")
    title = models.CharField(max_length=255, verbose_name="Titre de l'événement")
    description = models.TextField(verbose_name="Description détaillée")
    image = models.ImageField(upload_to='history/', blank=True, null=True, verbose_name="Image de l'événement")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="fr", verbose_name="Langue")
    order = models.IntegerField(default=0, help_text="Ordre d'affichage")

    class Meta:
        ordering = ['order', 'year']
        verbose_name = "Événement Historique"
        verbose_name_plural = "Chronologie - Historique"

    def __str__(self):
        return f"[{self.language.upper()}] {self.year} - {self.title}"

class MissionAxe(models.Model):
    LANGUAGE_CHOICES = (
        ("fr", "Français"),
        ("rn", "Kirundi"),
        ("en", "English"),
        ("sw", "Kiswahili"),
    )
    text = models.CharField(max_length=255, verbose_name="Axe de mission")
    image = models.ImageField(upload_to='axes/', blank=True, null=True, verbose_name="Photo de l'axe")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="fr", verbose_name="Langue")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Axe de Mission"
        verbose_name_plural = "Axes de Mission"

    def __str__(self):
        return f"[{self.language.upper()}] {self.text}"

class VisionValue(models.Model):
    LANGUAGE_CHOICES = (
        ("fr", "Français"),
        ("rn", "Kirundi"),
        ("en", "English"),
        ("sw", "Kiswahili"),
    )
    icon = models.CharField(max_length=50, help_text="Nom Lucide (Cross, Heart, Users, etc.)")
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='values/', blank=True, null=True, verbose_name="Photo de la valeur")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="fr", verbose_name="Langue")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Valeur"
        verbose_name_plural = "Valeurs"

    def __str__(self):
        return f"[{self.language.upper()}] {self.title}"

class TeamMember(models.Model):
    LANGUAGE_CHOICES = (
        ("fr", "Français"),
        ("rn", "Kirundi"),
        ("en", "English"),
        ("sw", "Kiswahili"),
    )
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='team/', blank=True, null=True, verbose_name="Photo de profil")
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default="fr", verbose_name="Langue")
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Membre de l'équipe"
        verbose_name_plural = "Équipe Diocésaine"

    def __str__(self):
        return f"[{self.language.upper()}] {self.name} - {self.role}"

class DiocesePresentation(models.Model):
    hero_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image Hero (Bandeau)")
    
    # French
    history_text_fr = models.TextField(verbose_name="Texte de l'historique (FR)", blank=True, null=True)
    bishop_message_fr = models.TextField(verbose_name="Message de l'évêque (FR)", blank=True, null=True)
    organization_text_fr = models.TextField(verbose_name="Texte sur l'organisation (FR)", blank=True, null=True)
    
    # Kirundi
    history_text_rn = models.TextField(verbose_name="Texte de l'historique (RN)", blank=True, null=True)
    bishop_message_rn = models.TextField(verbose_name="Message de l'évêque (RN)", blank=True, null=True)
    organization_text_rn = models.TextField(verbose_name="Texte sur l'organisation (RN)", blank=True, null=True)
    
    # English
    history_text_en = models.TextField(verbose_name="Texte de l'historique (EN)", blank=True, null=True)
    bishop_message_en = models.TextField(verbose_name="Message de l'évêque (EN)", blank=True, null=True)
    organization_text_en = models.TextField(verbose_name="Texte sur l'organisation (EN)", blank=True, null=True)
    
    # Swahili
    history_text_sw = models.TextField(verbose_name="Texte de l'historique (SW)", blank=True, null=True)
    bishop_message_sw = models.TextField(verbose_name="Message de l'évêque (SW)", blank=True, null=True)
    organization_text_sw = models.TextField(verbose_name="Texte sur l'organisation (SW)", blank=True, null=True)

    history_image = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Image de l'historique")
    bishop_name = models.CharField(max_length=255, verbose_name="Nom de l'évêque", blank=True, null=True)
    bishop_photo = models.ImageField(upload_to='diocese/', blank=True, null=True, verbose_name="Photo de l'évêque")

    class Meta:
        verbose_name = "Présentation du Diocèse"
        verbose_name_plural = "Présentation du Diocèse"

    def __str__(self):
        return "Présentation du Diocèse"

    def save(self, *args, **kwargs):
        if self.__class__.objects.count() and not self.pk:
            self.pk = self.__class__.objects.first().pk
        super().save(*args, **kwargs)
