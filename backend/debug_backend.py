import subprocess
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
python_exe = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')

with open('debug_output.txt', 'w', encoding='utf-8') as f:
    f.write("--- CHECK ---\n")
    subprocess.run([python_exe, 'manage.py', 'check'], stdout=f, stderr=f, cwd=backend_dir)
    
    f.write("\n--- MAKEMIGRATIONS ---\n")
    subprocess.run([python_exe, 'manage.py', 'makemigrations'], stdout=f, stderr=f, cwd=backend_dir)
    
    f.write("\n--- MIGRATE ---\n")
    subprocess.run([python_exe, 'manage.py', 'migrate'], stdout=f, stderr=f, cwd=backend_dir)

print("Debug script finished. Check debug_output.txt")
