from rest_framework import generics
from ..serializers.category import CategorySerializer
from api.models import Category


class CategoryListAPI(generics.ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.all()

        return queryset
