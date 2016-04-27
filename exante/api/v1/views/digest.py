import json
from rest_framework.response import Response
from rest_framework.views import APIView
from celery.result import AsyncResult
from ..serializers.digest_task_data import DigestTaskDataSerializer
from api.tasks.send_digest import send_digest


class DigestAPIView(APIView):

    def get(self, request):
        if self.request.GET.get('task_id'):
            result = AsyncResult(self.request.GET.get('task_id'))
            return Response({
                'status': result.status
            })
        return Response({})

    def post(self, request):
        serializer = DigestTaskDataSerializer(data={
            "categories": request.POST.getlist('categories[]'),
            "date_start": request.POST.get('date_start'),
            "date_end": request.POST.get('date_end'),
            "email": request.POST.get('email')
        })
        if serializer.is_valid():
            data = serializer.data
            task = send_digest.delay(
                data['categories'],
                data['date_start'],
                data['date_end'],
                data['email']
            )
            return Response({
                'task_id': task.task_id
            })
        return Response({
            'errors': serializer.errors
        })
