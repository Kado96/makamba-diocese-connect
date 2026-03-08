import subprocess
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
python_exe = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')

print(f"Using python: {python_exe}")

# Run migrations
print("Running makemigrations ministries...")
subprocess.run([python_exe, 'manage.py', 'makemigrations', 'ministries'], cwd=backend_dir)

print("Running migrate...")
subprocess.run([python_exe, 'manage.py', 'migrate'], cwd=backend_dir)

# Try to start server (non-blocking)
print("Starting server on port 8000...")
try:
    # On Windows, we can use DETACHED_PROCESS or CREATE_NEW_CONSOLE
    # But for an agent environment, simple Popen might work or might be killed.
    subprocess.Popen([python_exe, 'manage.py', 'runserver', '8000'], cwd=backend_dir)
    print("Server start command sent.")
except Exception as e:
    print(f"Failed to start server: {e}")
