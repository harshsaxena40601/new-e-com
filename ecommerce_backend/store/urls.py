from django.urls import path
from .views import home, get_cart, get_product_detail  # Removed run_migrations

urlpatterns = [
    path("", home, name="home"),  # Default homepage
    path("cart/", get_cart, name="get_cart"),  # ✅ Cart API route
    path("products/<int:pk>/", get_product_detail, name="get_product_detail"),  # Fixed URL pattern
]
