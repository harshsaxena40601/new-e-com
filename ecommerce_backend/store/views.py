from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product_detail(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Welcome to My E-commerce Site</h1>")
from django.http import JsonResponse
from django.core.management import call_command

def run_migrations(request):
    call_command("makemigrations", "store")
    call_command("migrate")
    return JsonResponse({"status": "Migrations applied!"})
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the E-Commerce API!"})

