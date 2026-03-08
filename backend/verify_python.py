import sys
import os

try:
    with open('verify_results.txt', 'w', encoding='utf-8') as f:
        f.write(f"Python: {sys.version}\n")
        f.write(f"CWD: {os.getcwd()}\n")
        
        try:
            import django
            f.write(f"Django: {django.get_version()}\n")
        except ImportError:
            f.write("Django NOT found\n")
            
        try:
            from django.conf import settings
            import os
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shalomministry.settings')
            django.setup()
            f.write("Django setup SUCCESS\n")
            
            from django.db import connection
            connection.ensure_connection()
            f.write("DB connection SUCCESS\n")
        except Exception as e:
            f.write(f"Django/DB Error: {str(e)}\n")
            
except Exception as e:
    # If we can't even write to the file, we have a big problem
    pass
