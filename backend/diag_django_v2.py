import sys
import os
import subprocess

backend_dir = r"e:\Application\Makamba\makamba-diocese-connect\backend"
python_exe = os.path.join(backend_dir, 'venv', 'Scripts', 'python.exe')
output_file = os.path.join(backend_dir, 'diag_results.txt')

def log(msg):
    with open(output_file, 'a', encoding='utf-8') as f:
        f.write(msg + "\n")

# Clear file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("=== START DIAGNOSTIC ===\n")

log(f"Python version: {sys.version}")
log(f"Current dir: {os.getcwd()}")

def run_cmd(args):
    log(f"Running: {' '.join(args)}")
    try:
        result = subprocess.run(args, cwd=backend_dir, capture_output=True, text=True, encoding='utf-8')
        log("STDOUT:")
        log(result.stdout)
        log("STDERR:")
        log(result.stderr)
        log(f"Return code: {result.returncode}")
    except Exception as e:
        log(f"EXCEPTION: {str(e)}")

# Run check
run_cmd([python_exe, 'manage.py', 'check'])

# Run showmigrations
run_cmd([python_exe, 'manage.py', 'showmigrations'])

# Test connection to port 8000
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(1)
try:
    s.connect(('127.0.0.1', 8000))
    log("Port 8000 is OPEN on 127.0.0.1")
    s.close()
except:
    log("Port 8000 is CLOSED on 127.0.0.1")

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(1)
    s.connect(('0.0.0.0', 8000))
    log("Port 8000 is OPEN on 0.0.0.0")
    s.close()
except:
    log("Port 8000 is CLOSED on 0.0.0.0")

log("=== END DIAGNOSTIC ===")
