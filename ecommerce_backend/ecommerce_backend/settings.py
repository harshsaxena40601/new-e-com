from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=str(BASE_DIR / ".env"))

# SECURITY SETTINGS
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "your-secret-key-here")

DEBUG = os.getenv("DEBUG", "True").strip().lower() in ["true", "1", "yes"]

# ALLOWED HOSTS
ALLOWED_HOSTS = [
    os.getenv("ALLOWED_HOST_1", "new-e-com-wirq.onrender.com"),
    os.getenv("ALLOWED_HOST_2", "127.0.0.1"),
    os.getenv("ALLOWED_HOST_3", "localhost"),
]

# INSTALLED APPS
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "store",
]

# MIDDLEWARE
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL CONFIGURATION
ROOT_URLCONF = "ecommerce_backend.urls"

# TEMPLATE SETTINGS
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
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

# WSGI APPLICATION
WSGI_APPLICATION = "ecommerce_backend.wsgi.application"

# DATABASE CONFIGURATION (Using SQLite)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# STATIC & MEDIA FILES CONFIGURATION
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"  # ✅ Fixed: Use relative URL
MEDIA_ROOT = BASE_DIR / "media"

# CORS HEADERS (Allow frontend to access API securely)
CORS_ALLOWED_ORIGINS = [
    "https://www.skhandicraft.com",
    "https://new-e-com-wirq.onrender.com",
]
CORS_ALLOW_CREDENTIALS = True

# CSRF TRUSTED ORIGINS
CSRF_TRUSTED_ORIGINS = [
    "https://www.skhandicraft.com",
]

# SECURITY ENHANCEMENTS (for production)
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

# DEFAULT PRIMARY KEY FIELD
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
