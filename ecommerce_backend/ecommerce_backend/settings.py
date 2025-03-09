from dotenv import load_dotenv
import os
from pathlib import Path
import pymysql
import cloudinary
import cloudinary.uploader
import cloudinary.api

# MySQL setup
pymysql.install_as_MySQLdb()

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=str(BASE_DIR / ".env"))

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", "duhtpjflg"),
    api_key=os.getenv("CLOUDINARY_API_KEY", "127956619714857"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", "GYk7RQ2uSshx_xLsLDjm_D3v79c")
)

# Security Settings
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "your-secret-key-here")
DEBUG = os.getenv("DEBUG", "True").strip().lower() in ["true", "1", "yes"]

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "new-e-com-wirq.onrender.com",
    os.getenv("ALLOWED_HOST", "")
]

# Installed Apps
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
    "cloudinary",
    "cloudinary_storage",
]

# Middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL Configuration
ROOT_URLCONF = "ecommerce_backend.urls"

# Templates
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

# WSGI Application
WSGI_APPLICATION = "ecommerce_backend.wsgi.application"

# Database Configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "ecommerce_db_5g24"),
        "USER": os.getenv("DB_USER", "ecommerce_db_5g24_user"),
        "PASSWORD": os.getenv("DB_PASSWORD", "0P14lcOOTz8QpboX5BgbSpvdnBEbUbBt"),
        "HOST": os.getenv("DB_HOST", "dpg-cv4qru52ng1s73bqql80-a.oregon-postgres.render.com"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}

# Static & Media Files
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# CORS Headers
CORS_ALLOWED_ORIGINS = [
    "https://www.skhandicraft.com",
    "https://new-e-com-wirq.onrender.com",
]
CORS_ALLOW_CREDENTIALS = True

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS = [
    "https://www.skhandicraft.com",
]

# Security Enhancements (For Production)
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

# Default Primary Key Field Type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
