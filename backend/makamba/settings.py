# ==========================
# DJANGO SETTINGS
# ==========================

import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# ==========================
# LOAD ENV
# ==========================

def load_env():
    dotenv_path = os.path.join(BASE_DIR, '.env')
    if os.path.exists(dotenv_path):
        with open(dotenv_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    value = value.strip('"').strip("'")
                    os.environ.setdefault(key.strip(), value.strip())

load_env()

# ==========================
# SECURITY
# ==========================

SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "django-insecure-change-me"
)

DEBUG = os.environ.get("DEBUG", "True").lower() == "true"

# ==========================
# ALLOWED HOSTS
# ==========================

env_allowed_hosts = os.environ.get("ALLOWED_HOSTS")
if env_allowed_hosts:
    ALLOWED_HOSTS = [host.strip() for host in env_allowed_hosts.split(',')]
else:
    ALLOWED_HOSTS = [
        "localhost",
        "127.0.0.1",
        "10.10.107.8",
        "makamba-diocese-connect.onrender.com",
        "anglicanemakamba.wuaze.com",
        "www.anglicanemakamba.wuaze.com",
    ]

# ==========================
# APPLICATIONS
# ==========================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "corsheaders",

    "api.accounts",
    "api.settings",
    "api.testimonials",
    "api.announcements",
    "api.parishes",
    "api.ministries",
    "api.pages",
    "api.sermons",
]

# ==========================
# MIDDLEWARE
# ==========================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "api.middlewares.DisableCSRF",
]

ROOT_URLCONF = "makamba.urls"

WSGI_APPLICATION = "makamba.wsgi.application"

# ==========================
# DATABASE
# ==========================

DATABASE_URL = os.environ.get("DATABASE_URL")

# Charger les variables (Inclus USE_LOCAL_SQLITE)
USE_LOCAL_SQLITE = os.getenv('USE_LOCAL_SQLITE', 'False').lower() == 'true'

if DATABASE_URL and not USE_LOCAL_SQLITE:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=0, # On réduit pour éviter de saturer Supabase
            ssl_require=True
        )
    }
else:
    # SQLITE par défaut si USE_LOCAL_SQLITE=True
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ==========================
# PASSWORD VALIDATION
# ==========================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==========================
# INTERNATIONALIZATION
# ==========================

LANGUAGE_CODE = "fr-fr"

TIME_ZONE = "Africa/Bujumbura"

USE_I18N = True
USE_TZ = True

# ==========================
# STATIC FILES
# ==========================

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ==========================
# MEDIA
# ==========================

MEDIA_URL = "/api/media/"

MEDIA_ROOT = BASE_DIR / "media"

# ==========================
# DEFAULT PRIMARY KEY
# ==========================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==========================
# REST FRAMEWORK
# ==========================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

# ==========================
# CORS CONFIGURATION
# ==========================

from corsheaders.defaults import default_headers

# Autoriser les origines en production
if not DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "https://anglicanemakamba.wuaze.com",
        "http://anglicanemakamba.wuaze.com",
        "https://www.anglicanemakamba.wuaze.com",
        "http://www.anglicanemakamba.wuaze.com",
        "https://makamba-diocese-connect.onrender.com",
    ]
    # Domaines de confiance pour les requêtes CSRF (formulaires, API PATCH/POST)
    CSRF_TRUSTED_ORIGINS = [
        "https://anglicanemakamba.wuaze.com",
        "http://anglicanemakamba.wuaze.com",
        "https://www.anglicanemakamba.wuaze.com",
        "http://www.anglicanemakamba.wuaze.com",
        "https://makamba-diocese-connect.onrender.com",
    ]
else:
    # En développement, autoriser tout pour faciliter la connexion
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ]

# Autoriser les credentials (login, token, session)
CORS_ALLOW_CREDENTIALS = True

# Headers autorisés (important pour le preflight)
CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
    "content-type",
]

# ==========================
# TEMPLATES
# ==========================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# CONFIGURATION LOGS
import os
LOGS_DIR = BASE_DIR / "logs"
if not LOGS_DIR.exists():
    os.makedirs(LOGS_DIR)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': LOGS_DIR / "error.log",
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}