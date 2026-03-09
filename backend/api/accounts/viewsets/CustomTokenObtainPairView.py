from .dependencies import *
from rest_framework import parsers
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    # S'assurer que les parsers JSON sont disponibles
    parser_classes = [parsers.JSONParser, parsers.FormParser, parsers.MultiPartParser]
    
    def post(self, request, *args, **kwargs):
        """Override post pour assurer une réponse JSON propre"""
        from rest_framework.exceptions import APIException
        try:
            return super().post(request, *args, **kwargs)
        except APIException as e:
            # Propager les exceptions DRF (401, 403, etc.) normalement
            raise e
        except Exception as e:
            logger.error(f"Erreur inattendue dans CustomTokenObtainPairView.post: {e}", exc_info=True)
            # Retourner une erreur 500 JSON claire seulement pour les vrais crashs
            return Response({
                'detail': f'Erreur système lors de la connexion. Veuillez réessayer plus tard.',
                'error': str(e),
                'error_type': type(e).__name__,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)