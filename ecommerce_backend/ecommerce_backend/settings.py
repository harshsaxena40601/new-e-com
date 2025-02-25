import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY SETTINGS
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "r4cJRrCnetfojAey1XbiqzYs_EdyvA4VQVQG7zz0GaJr5E6agIwO7JXtjIXUPY885SU")
DEBUG = os.getenv("DEBUG", "False") == "True"



# ALLOWED HOSTS (Updated)
ALLOWED_HOSTS = [
    "new-e-com.onrender.com",  # Render app domain (removed https://)
    "127.0.0.1",
    "localhost"
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
    "corsheaders.middleware.CorsMiddleware",  # CORS Middleware
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

# DATABASE CONFIGURATION (For Local & Render Deployment)
DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}", conn_max_age=600
    
)}

# STATIC & MEDIA FILES CONFIGURATION
STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# CORS HEADERS (Allow frontend to access API securely)
CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",  # VS Code Live Server
    "http://localhost:3000",  # React frontend (if applicable)
    "https://your-frontend-url.com",  # Replace with actual frontend URL
    "https://new-e-com.onrender.com",  # Allow Render frontend if applicable
]

CORS_ALLOW_CREDENTIALS = True  # Allows cookies, sessions, etc.

# DEFAULT PRIMARY KEY FIELD
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
