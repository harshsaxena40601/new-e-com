from django.urls import path, re_path
from .views import get_products, get_product_detail

urlpatterns = [
    path('products/', get_products, name='get_products'),  
    re_path(r'^products/(?P<pk>\d+)/?$', get_product_detail, name='get_product_detail'),  # Allows both /1 and /1/
]
