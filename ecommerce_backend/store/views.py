from django.http import JsonResponse
from .models import Cart  # Import your Cart model if it exists

# Cart API - Returns all items in the cart
def get_cart(request):
    cart_items = Cart.objects.all()  # Replace with actual cart retrieval logic
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
