from django.urls import path
from .views import home, get_cart, get_product_detail, get_all_products  # ✅ Import get_all_products

urlpatterns = [
    path("", home, name="home"),  # ✅ Default homepage
    path("cart/", get_cart, name="get_cart"),  # ✅ Cart API route
    path("products/", get_all_products, name="get_all_products"),  # ✅ Fix: Add this route
    path("products/<int:pk>/", get_product_detail, name="get_product_detail"),  # ✅ Fix: Ensure this matches the API call
]
