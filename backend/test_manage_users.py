import os
import django
import json
import re

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "makamba.settings")
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import traceback

try:
    client = Client()

    # Get a superuser to authenticate
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("No superuser found.")
    else:
        token = RefreshToken.for_user(admin_user).access_token
        
        # Try POST
        response = client.post(
            '/api/accounts/manage-users/',
            data=json.dumps({"username": "new_test_user_unique", "password": "securepassword", "role": "user"}),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
            SERVER_NAME='localhost',
            SERVER_PORT='8000'
        )
        print(f"Status: {response.status_code}")
        
        html = response.content.decode('utf-8')
        if "<html>" in html:
            title_match = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
            print(f"Error Title: {title_match.group(1).strip() if title_match else 'No Title'}")
            
            exc_match = re.search(r'<div class="exception_value">(.*?)</div>', html, re.DOTALL)
            print(f"Exception Value: {exc_match.group(1).strip() if exc_match else 'No Exception Value'}")
            
            summary_match = re.search(r'<div id="summary">(.*?)</div>', html, re.DOTALL)
            if summary_match:
                print(f"Summary: {summary_match.group(1).strip()[:500]}")
        else:
            print(html)
except Exception as e:
    print(f"Exception: {e}")
