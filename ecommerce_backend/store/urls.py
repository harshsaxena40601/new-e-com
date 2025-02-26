from django.urls import path, re_path
from .views import get_products, get_product_detail, run_migrations, home

urlpatterns = [
    path("", home, name="home"),  # Default homepage to prevent 404
    path("products/", get_products, name="get_products"),  
    re_path(r"^products/(?P<pk>\d+)/?$", get_product_detail, name="get_product_detail"),
    path("run-migrations/", run_migrations, name="run_migrations"),
]
