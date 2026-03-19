from django.db import models

class MinistryPage(models.Model):
    hero_image = models.ImageField(upload_to='ministries/', blank=True, null=True, verbose_name="Image Hero")
    
    # Hero Texts
    hero_badge_fr = models.CharField(max_length=255, verbose_name="Badge Hero (FR)", default="NOS ACTIONS")
    hero_badge_en = models.CharField(max_length=255, verbose_name="Badge Hero (EN)", blank=True, null=True, default="OUR ACTIONS")

    hero_title_fr = models.CharField(max_length=255, verbose_name="Titre Hero (FR)", default="Ministères")
    hero_title_en = models.CharField(max_length=255, verbose_name="Titre Hero (EN)", blank=True, null=True, default="Ministries")

    hero_description_fr = models.TextField(verbose_name="Description Hero (FR)", blank=True, null=True)
    hero_description_en = models.TextField(verbose_name="Description Hero (EN)", blank=True, null=True)

    class Meta:
        verbose_name = "Page Ministères (Introduction)"
        verbose_name_plural = "Page Ministères (Introduction)"

    def __str__(self):
        return "Contenu de la page Ministères"

    def save(self, *args, **kwargs):
        if self.__class__.objects.count() and not self.pk:
            self.pk = self.__class__.objects.first().pk
        super().save(*args, **kwargs)

class Ministry(models.Model):
    title_fr = models.CharField(max_length=255, verbose_name="Titre du ministère (FR)", default="Ministère")
    title_en = models.CharField(max_length=255, verbose_name="Titre du ministère (EN)", blank=True, null=True)

    mission_fr = models.TextField(verbose_name="Mission / Description (FR)", blank=True, null=True)
    mission_en = models.TextField(verbose_name="Mission / Description (EN)", blank=True, null=True)

    icon = models.CharField(max_length=50, default="Users", help_text="Nom de l'icône Lucide (ex: Users, Heart, BookOpen, Sprout)")
    
    testimony_quote_fr = models.TextField(blank=True, null=True, verbose_name="Citation du témoignage (FR)")
    testimony_quote_en = models.TextField(blank=True, null=True, verbose_name="Citation du témoignage (EN)")

    testimony_author = models.CharField(max_length=255, blank=True, null=True, verbose_name="Auteur du témoignage")
    image = models.ImageField(upload_to='ministries/', blank=True, null=True, verbose_name="Image illustrative")
    
    order = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title_fr or "Ministère"

    class Meta:
        verbose_name = "Ministère"
        verbose_name_plural = "Ministères"

class MinistryActivity(models.Model):
    ministry = models.ForeignKey(Ministry, related_name='activities', on_delete=models.CASCADE)
    title_fr = models.CharField(max_length=255, verbose_name="Titre de l'activité (FR)", blank=True, null=True)
    title_en = models.CharField(max_length=255, verbose_name="Titre de l'activité (EN)", blank=True, null=True)
    
    def __str__(self):
        return f"{self.ministry.title_fr} - {self.title_fr}"
    
    class Meta:
        verbose_name = "Activité de ministère"
        verbose_name_plural = "Activités de ministère"
