import urllib.request, json
import sys

# On force l'encodage pour éviter les erreurs de caractères sur Windows
sys.stdout.reconfigure(encoding='utf-8')

def test_prod_api():
    urls = {
        'Page Presentation': 'https://makamba-diocese-connect.onrender.com/api/pages/diocese-presentation/current/',
        'Settings': 'https://makamba-diocese-connect.onrender.com/api/settings/current/'
    }
    
    for name, url in urls.items():
        print(f"Testing {name} ({url})...")
        try:
            req = urllib.request.Request(url, headers={'Accept': 'application/json'})
            with urllib.request.urlopen(req) as resp:
                data = json.load(resp)
                print(f"  OK: SUCCESS (200)")
                if name == 'Settings':
                    print(f"     Logo URL: {data.get('logo_display')}")
        except Exception as e:
            print(f"  ERROR: {e}")

if __name__ == '__main__':
    test_prod_api()
