from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth.models import User
from api.accounts.models import Account
from api.accounts.viewsets.dependencies import IsAdminOrSuperUser


class UserManagementViewSet(viewsets.ViewSet):
    """
    API pour la gestion des utilisateurs (admin uniquement).
    Permet de lister, créer, modifier et supprimer des utilisateurs.
    """
    permission_classes = [IsAuthenticated, IsAdminOrSuperUser]
    
    def list(self, request):
        """Liste tous les utilisateurs avec leurs rôles"""
        users = User.objects.all().select_related('account').order_by('-date_joined')
        data = []
        for user in users:
            account = getattr(user, 'account', None)
            data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'role': account.role if account else 'admin',
                'date_joined': user.date_joined.isoformat(),
                'last_login': user.last_login.isoformat() if user.last_login else None,
            })
        return Response(data)
    
    def create(self, request):
        """Créer un nouvel utilisateur"""
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        email = request.data.get('email', '').strip()
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        role = request.data.get('role', 'user')
        
        if not username or not password:
            return Response(
                {'error': 'Le nom d\'utilisateur et le mot de passe sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Ce nom d\'utilisateur existe déjà.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'utilisateur Django
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_staff=True,  # Nécessaire pour accéder à l'admin
        )
        
        # Créer ou mettre à jour l'Account avec le rôle
        account, _ = Account.objects.get_or_create(user=user)
        account.role = role
        account.save()
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': account.role,
            'is_active': user.is_active,
            'message': f'Utilisateur "{username}" créé avec succès en tant que {account.get_role_display()}.'
        }, status=status.HTTP_201_CREATED)
    
    def partial_update(self, request, pk=None):
        """Modifier un utilisateur existant"""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Ne pas permettre de modifier le superuser sauf par un superuser
        if user.is_superuser and not request.user.is_superuser:
            return Response({'error': 'Vous ne pouvez pas modifier un super-administrateur.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Mettre à jour les champs fournis
        if 'email' in request.data:
            user.email = request.data['email']
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'is_active' in request.data:
            user.is_active = request.data['is_active']
        if 'password' in request.data and request.data['password']:
            user.set_password(request.data['password'])
        
        user.save()
        
        # Mettre à jour le rôle
        if 'role' in request.data:
            account, _ = Account.objects.get_or_create(user=user)
            account.role = request.data['role']
            account.save()
        
        account = getattr(user, 'account', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': account.role if account else 'admin',
            'is_active': user.is_active,
            'message': f'Utilisateur "{user.username}" mis à jour avec succès.'
        })
    
    def destroy(self, request, pk=None):
        """Supprimer un utilisateur"""
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'Utilisateur non trouvé.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Ne pas supprimer le superuser ou soi-même
        if user.is_superuser:
            return Response({'error': 'Impossible de supprimer le super-administrateur.'}, status=status.HTTP_403_FORBIDDEN)
        if user.id == request.user.id:
            return Response({'error': 'Vous ne pouvez pas supprimer votre propre compte.'}, status=status.HTTP_403_FORBIDDEN)
        
        username = user.username
        user.delete()
        return Response({'message': f'Utilisateur "{username}" supprimé avec succès.'})
