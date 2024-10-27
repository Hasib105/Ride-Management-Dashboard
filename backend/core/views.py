from django.shortcuts import render
from django.db.models import Count
from .models import Driver, Trip, Earning
from .serializers import DriverSerializer
from django.db.models.functions import TruncDay
from django.db.models import Sum
# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response


#Test Frontend
class ExampleView(APIView):
    def get(self, request):
        data = {"message": "Hello from Django!"}
        return Response(data)
    


class DriverStatusCountView(APIView):
    def get(self, request):
        status_counts = Driver.objects.values('status').annotate(count=Count('status'))
        return Response(status_counts)




class DriverLocationView(APIView):
    def get(self, request):
        drivers = Driver.objects.all()
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)
    

class TripStatisticsView(APIView):
    def get(self, request):
        trip_counts = {
            "total_trips": Trip.objects.count(),
            "in_process_trips": Trip.objects.filter(status="IN_PROCESS").count(),
            "canceled_trips": Trip.objects.filter(status="CANCELED").count(),
            "completed_trips": Trip.objects.filter(status="COMPLETED").count()
        }
        return Response(trip_counts)
    



class EarningsReportView(APIView):
    def get(self, request):
        earnings = (
            Earning.objects.annotate(day=TruncDay('date'))
            .values('day')
            .annotate(total_amount=Sum('amount'))
            .order_by('day')
        )
        return Response(earnings)