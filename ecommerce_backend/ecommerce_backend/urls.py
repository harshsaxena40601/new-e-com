# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('store.urls')),  # API endpoints
# ]

# # ✅ Serve Media Files in Development
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('your_api_app.urls')),
#     path('', home),  # Default route
# ]
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from store.views import home  # Import home view if needed

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),  # ✅ Correct API endpoints
    path('', home),  # ✅ Default route
]

# ✅ Serve Media Files in Development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.urls import path, include

urlpatterns = [
    path("api/", include("store.urls")),  # Ensure "store.urls" is included!
]
