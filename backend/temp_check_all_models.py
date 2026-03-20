
import re
import os
from collections import Counter

def check_file(path):
    if not os.path.exists(path):
        return
    content = open(path, 'r', encoding='utf-8').read()
    
    # On cherche les lignes qui correspondent à des champs (nom = models.XField)
    # On filtre les commentaires et les lignes vides
    fields = []
    current_class = None
    
    for line in content.split('\n'):
        if line.startswith('class '):
            current_class = line.split('(')[0].replace('class ', '').strip()
            fields = []
        elif line.startswith('    ') and not line.strip().startswith('#') and 'models.' in line and '=' in line:
            field_name = line.split('=')[0].strip()
            if field_name:
                fields.append(field_name)
                counts = Counter(fields)
                if counts[field_name] > 1:
                    print(f"[DUPE] in {path} (class {current_class}): {field_name}")

apps = ['accounts', 'announcements', 'ministries', 'pages', 'parishes', 'sermons', 'settings', 'testimonials']
for app in apps:
    check_file(f'e:/Application/Makamba/makamba-diocese-connect/backend/api/{app}/models.py')
