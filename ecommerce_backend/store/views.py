from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Cart, Product  # Ensure these models exist

# ✅ Home view
def home(request):
    return JsonResponse({"message": "Welcome to the Home Page!"})

# ✅ Cart API - Returns all items in the cart
def get_cart(request):
    cart_items = Cart.objects.all()
    cart_data = [
        {
            "productName": item.product.name,
            "price": str(item.product.price),  # Convert price to string for JSON compatibility
            "quantity": item.quantity,
            "image": item.product.image.url if item.product.image else "",
        }
        for item in cart_items
    ]
    return JsonResponse(cart_data, safe=False)

# ✅ Get All Products API
def get_all_products(request):
    products = Product.objects.all()
    products_data = [
        {
            "id": product.id,
            "name": product.name,
            "price": str(product.price),  # Convert price to string
            "description": product.description,
            "image": product.image.url if product.image else "",
        }
        for product in products
    ]
    return JsonResponse(products_data, safe=False)

# ✅ Get Product Detail API
def get_product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product_data = {
        "id": product.id,
        "name": product.name,
        "price": str(product.price),
        "description": product.description,
        "image": product.image.url if product.image else "",
    }
    return JsonResponse(product_data)
