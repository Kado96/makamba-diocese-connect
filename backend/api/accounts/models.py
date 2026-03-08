from django.db import models
from django.contrib.auth.models import User

SEXES = (
    ("H", "HOMME"),
    ("F", "FEMME"),
    ("N/A", "NON APPLICABLE")
)

ROLE_CHOICES = (
    ("admin", "Administrateur"),
    ("user", "Utilisateur"),
)

class Account(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="admin", help_text="admin = tous les droits, user = actualités et ressources uniquement")
    
    phone_number = models.CharField(max_length=16, unique=True, null=True)
    otp_code = models.CharField(max_length=5, editable=False, null=True)
    otp_expire_at = models.DateTimeField(blank=True, null=True)   
    email_validated = models.BooleanField(default=False)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} ({self.get_role_display()})"

    def complete(self):
        return (
            bool(self.phone_number) and
            bool(self.email_validated)
    )
