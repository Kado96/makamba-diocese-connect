from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .AccountSerializer import BasicAccountSerializer
from random import randrange
from datetime import timedelta
import random
from django.utils import timezone

# Imports optionnels (si les modules existent)
try:
    from api.tools import send_custom_email
except ImportError:
    send_custom_email = None



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @staticmethod
    def generateOTP(account):
        if not (account.otp_code and account.otp_expire_at and account.otp_expire_at > timezone.now()):
            account.last_otp_asked = timezone.now()
            otp = "%05d"%randrange(1000, 99999)
            account.otp_code = otp
            account.otp_expire_at = timezone.now() + timedelta(minutes=3)
            account.save()

        if send_custom_email:
            try:
                mail_data = {
                    "email": [account.user.username],
                    "otp": account.otp_code,
                }
                print(f"[OTP] : {account.otp_code}")
                send_custom_email(mail_data, "account_creation_otp.html")
            except Exception as e:
                print(f"[OTP] Erreur lors de l'envoi de l'email: {e}")

    def validate(self, attrs):
        try:
            data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        except Exception as e:
            # Si la validation de base échoue (mauvais username/password), propager l'erreur
            raise
        
        # Ajouter les informations de base de l'utilisateur (toujours présentes)
        try:
            data['username'] = self.user.username
        except:
            data['username'] = ''
        
        try:
            data['first_name'] = self.user.first_name or ''
        except:
            data['first_name'] = ''
        
        try:
            data['last_name'] = self.user.last_name or ''
        except:
            data['last_name'] = ''
        
        try:
            data['id'] = self.user.id
        except:
            data['id'] = None
        
        try:
            data['is_superuser'] = self.user.is_superuser
        except:
            data['is_superuser'] = False
        
        try:
            data['is_staff'] = self.user.is_staff  # Ajouter is_staff dans le token
        except:
            data['is_staff'] = False
        
        try:
            data['email'] = self.user.email or ''
        except:
            data['email'] = ''
        
        try:
            data['groups'] = [group.name for group in self.user.groups.all()]
        except:
            data['groups'] = []
        
        # Ajouter le rôle depuis l'Account
        data['role'] = 'admin'  # Par défaut admin pour les superusers
        
        # Vérifier si l'Account existe (relation optionnelle)
        # Le login ne doit pas échouer si Account n'existe pas
        try:
            from api.accounts.models import Account
            
            # Essayer d'accéder à la relation account
            try:
                account = Account.objects.get(user=self.user)
                
                # Récupérer le rôle depuis l'Account
                data['role'] = 'admin' if self.user.is_superuser else account.role
                
                # Essayer d'ajouter les données account
                try:
                    account_data = BasicAccountSerializer(account).data
                    if account_data:
                        data['account'] = account_data
                except Exception as account_error:
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f"Erreur lors de la sérialisation de l'account: {account_error}")
                    pass
                

                        
            except Account.DoesNotExist:
                # Créer l'Account s'il n'existe pas (optionnel, non bloquant)
                try:
                    account = Account.objects.create(user=self.user)
                    try:
                        data['account'] = BasicAccountSerializer(account).data
                    except Exception:
                        pass
                except Exception as e:
                    # Si la création échoue, continuer sans account (non bloquant)
                    pass
            except Exception as e:
                # Toute autre erreur, continuer sans account (non bloquant)
                pass
        except ImportError:
            # Si Account n'existe pas, continuer sans
            pass
        except Exception as e:
            # Si erreur avec Account, continuer sans (non bloquant pour le login)
            pass
        
        # Mettre à jour les groupes seulement si pas déjà défini
        if 'groups' not in data or not data.get('groups'):
            groups = []
            try:
                if self.user.is_superuser:
                    groups.append({"admin": self.user.id})
            except:
                pass
            data["groups"] = groups
        
        return data