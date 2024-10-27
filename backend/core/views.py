from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response


#Test Frontend
class ExampleView(APIView):
    def get(self, request):
        data = {"message": "Hello from Django!"}
        return Response(data)