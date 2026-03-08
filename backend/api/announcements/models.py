from django.db import models

class Announcement(models.Model):
    PRIORITY_CHOICES = [
        ('basse', 'Basse'),
        ('normale', 'Normale'),
        ('haute', 'Haute'),
    ]

    CATEGORY_CHOICES = [
        ('temoignages', 'Témoignages'),
        ('evenements', 'Événements'),
        ('nouvelles', 'Nouvelles'),
    ]

    LANGUAGE_CHOICES = [
        ('fr', 'Français'),
        ('rn', 'Kirundi'),
        ('en', 'English'),
        ('sw', 'Kiswahili'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='nouvelles')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normale')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    event_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='announcements/', blank=True, null=True, verbose_name="Image à la une")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class AnnouncementImage(models.Model):
    announcement = models.ForeignKey(Announcement, related_name='gallery', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='announcements/gallery/')
    caption = models.CharField(max_length=255, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
