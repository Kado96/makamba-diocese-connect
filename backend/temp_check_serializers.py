
import re

def check_serializer(path):
    content = open(path, 'r', encoding='utf-8').read()
    
    # On cherche le bloc fields = [...]
    match = re.search(r'fields\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if not match:
        return
    
    fields_content = match.group(1)
    # Extraire les noms de champs entre apostrophes ou guillemets
    fields = re.findall(r"['\"]([a-zA-Z0-9_]+)['\"]", fields_content)
    
    seen = set()
    dupes = []
    for f in fields:
        if f in seen:
            dupes.append(f)
        seen.add(f)
    
    if dupes:
        print(f"DUPLICATE fields in serializer Meta {path}: {dupes}")

paths = [
    'e:/Application/Makamba/makamba-diocese-connect/backend/api/pages/serializers.py',
    'e:/Application/Makamba/makamba-diocese-connect/backend/api/settings/serializers.py'
]
for p in paths:
    check_serializer(p)
