
import re
from collections import Counter

content = open('e:/Application/Makamba/makamba-diocese-connect/backend/api/pages/models.py', 'r', encoding='utf-8').read()

# On cherche les déclarations de champs (pattern simplifié : nom = models.TypeField)
# On ne prend que ce qui est à l'intérieur de la classe DiocesePresentation (ligne 97 et suivantes)
dp_content = content[content.find('class DiocesePresentation'):]

fields = re.findall(r'^\s\s\s\s([a-z_0-9]+)\s*=', dp_content, re.MULTILINE)
counts = Counter(fields)

duplicates = [name for name, count in counts.items() if count > 1]
print(f"Duplicates in DiocesePresentation: {duplicates}")

if duplicates:
    for name in duplicates:
        # Trouver les numéros de ligne
        matches = [m.start() for m in re.finditer(f'\\s\\s\\s\\s{name}\\s*=', dp_content)]
        print(f"  Field '{name}' found at positions in dp_content: {matches}")
