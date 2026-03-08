@echo off
echo Starting Django Server Diagnostic...
cd /d e:\Application\Makamba\makamba-diocese-connect\backend
echo Current Dir: %CD%
call venv\Scripts\activate.bat
echo Virtual Env Activated.
echo Python Path:
where python
python manage.py check > check_output.txt 2>&1
echo Check completed. Starting runserver...
python manage.py runserver 0.0.0.0:8000 > runserver_output.txt 2>&1
