# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.views.generic import TemplateView


urlpatterns = [
    url(r'^$', TemplateView.as_view(
        template_name="index/index.html"
    ), name='home-page'),
]
