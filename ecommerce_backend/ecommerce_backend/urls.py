from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from store.views import home  # Import home view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("store.urls")),  # Correct API endpoint
    path("", home, name="home"),  # Default route
]

# ✅ Serve Media Files in Development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
