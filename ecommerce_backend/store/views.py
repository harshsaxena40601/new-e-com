from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Cart, Product  # Ensure these models exist

# Home view
def home(request):
    return JsonResponse({"message": "Welcome to the Home Page!"})

# Cart API - Returns all items in the cart
def get_cart(request):
    cart_items = Cart.objects.all()  
    cart_data = [
        {
            "productName": item.product.name, 
            "price": item.product.price, 
            "quantity": item.quantity,
            "image": item.product.image.url if item.product.image else ""
        } 
        for item in cart_items
    ]
    return JsonResponse(cart_data, safe=False)

# ✅ Get Product Detail API
def get_product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)  
    product_data = {
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "image": product.image.url if product.image else "",
    }
    return JsonResponse(product_data)
