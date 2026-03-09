from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.accounts'

    def ready(self):
        from django.db.models.signals import post_migrate
        post_migrate.connect(self.create_superuser, sender=self)

    def create_superuser(self, **kwargs):
        from django.apps import apps
        import os

        # Utiliser apps.get_model pour éviter les problèmes d'importation circulaire
        User = apps.get_model('auth', 'User')
        Account = apps.get_model('accounts', 'Account')

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "donald")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "maecoginfa@gmail.com")

        if not User.objects.filter(username=username).exists():
            print(f"--- Creating superuser: {username} ---")
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            # Créer le profil Account associé
            Account.objects.update_or_create(
                user=user,
                defaults={'role': 'admin', 'is_active': True}
            )
            print(f"--- Superuser {username} created successfully ---")
        else:
            # S'assurer que les accès sont corrects (staff/superuser)
            user = User.objects.get(username=username)
            if not user.is_superuser or not user.is_staff:
                user.is_superuser = True
                user.is_staff = True
                user.save()
            
            # S'assurer que le profil Account existe
            Account.objects.update_or_create(
                user=user,
                defaults={'role': 'admin', 'is_active': True}
            )
            print(f"--- Superuser {username} verified/updated successfully ---")
