from django.db import models
from django.contrib.auth.models import User  # ✅ Import User model

# ✅ Import Product model before using it
class Product(models.Model):  
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="product_images/", null=True, blank=True)

    def __str__(self):
        return self.name

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Associate cart with a user
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Link to Product
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
