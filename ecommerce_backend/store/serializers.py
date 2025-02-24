from rest_framework import serializers
from store.models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)  # Full URL
            return f"http://127.0.0.1:8000{obj.image.url}"  # Hardcoded fallback
        return None

    class Meta:
        model = Product
        fields = '__all__'
