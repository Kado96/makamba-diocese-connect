@echo off
echo 🚀 Démarrage du serveur Django Makamba Connect...
cd /d "%~dp0"
call venv\Scripts\activate.bat
echo ✅ Environnement virtuel activé
echo Demarrage du serveur sur localhost:8000...
echo Le proxy Vite redirigera les requetes /api vers ce serveur
python manage.py runserver 127.0.0.1:8000
pause
