@echo off
echo.
echo --- CHECKING DJANGO ---
venv\Scripts\python.exe manage.py check
echo.
echo --- MAKING MIGRATIONS ---
venv\Scripts\python.exe manage.py makemigrations ministries
echo.
echo --- APPLYING MIGRATIONS ---
venv\Scripts\python.exe manage.py migrate
echo.
echo --- DONE ---
