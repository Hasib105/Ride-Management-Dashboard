from django.shortcuts import render
from django.db.models import Count
from .models import Driver, Trip, Earning
from .serializers import DriverSerializer
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
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
        # Aggregate daily, weekly, and monthly totals
        daily_total = (
            Earning.objects.annotate(day=TruncDay('date'))
            .values('day')
            .annotate(total_amount=Sum('amount'))
            .order_by('-day')[:1]
        )
        weekly_total = (
            Earning.objects.annotate(week=TruncWeek('date'))
            .values('week')
            .annotate(total_amount=Sum('amount'))
            .order_by('-week')[:1]
        )
        monthly_total = (
            Earning.objects.annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total_amount=Sum('amount'))
            .order_by('-month')[:1]
        )

        # Detailed earnings for selected period
        period = request.query_params.get("period", "daily")
        if period == "daily":
            earnings = (
                Earning.objects.annotate(day=TruncDay('date'))
                .values('day')
                .annotate(total_amount=Sum('amount'))
                .order_by('day')
            )
        elif period == "weekly":
            earnings = (
                Earning.objects.annotate(week=TruncWeek('date'))
                .values('week')
                .annotate(total_amount=Sum('amount'))
                .order_by('week')
            )
        elif period == "monthly":
            earnings = (
                Earning.objects.annotate(month=TruncMonth('date'))
                .values('month')
                .annotate(total_amount=Sum('amount'))
                .order_by('month')
            )
        else:
            return Response({"error": "Invalid period"}, status=400)

        return Response({
            "daily_total": daily_total[0] if daily_total else {"total_amount": 0},
            "weekly_total": weekly_total[0] if weekly_total else {"total_amount": 0},
            "monthly_total": monthly_total[0] if monthly_total else {"total_amount": 0},
            "earnings": earnings,
        })