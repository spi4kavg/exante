# -*- coding: utf-8 -*-
from rest_framework import serializers


class DigestTaskDataSerializer(serializers.Serializer):
    categories = serializers.ListField(
        child=serializers.IntegerField(required=True),
        required=True
    )
    date_start = serializers.DateField(required=True)
    date_end = serializers.DateField(required=True)
    email = serializers.EmailField(required=True)
