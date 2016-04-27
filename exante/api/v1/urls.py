from django.conf.urls import url
from views.category import CategoryListAPI
from views.digest import DigestAPIView


urlpatterns = [
    url(r'categories/$', CategoryListAPI.as_view(), name="categories-list"),
    url(r'digset/$', DigestAPIView.as_view(), name='digest-api'),
]
