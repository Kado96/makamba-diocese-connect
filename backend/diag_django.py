import sys
import os
import subprocess

backend_dir = r"e:\Application\Makamba\makamba-diocese-connect\backend"
python_exe = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')

def run_cmd(args):
    print(f"Running: {' '.join(args)}")
    result = subprocess.run(args, cwd=backend_dir, capture_output=True, text=True)
    print("STDOUT:")
    print(result.stdout)
    print("STDERR:")
    print(result.stderr)
    return result

print(f"Python version: {sys.version}")
print(f"Current dir: {os.getcwd()}")

# Check if manage.py exists
if os.path.exists(os.path.join(backend_dir, 'manage.py')):
    print("manage.py found.")
else:
    print("manage.py NOT found!")

# Run check
run_cmd([python_exe, 'manage.py', 'check'])

# Run migrate --list
run_cmd([python_exe, 'manage.py', 'showmigrations'])
