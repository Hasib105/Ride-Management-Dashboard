from django.shortcuts import render
from django.db.models import Count
from .models import Driver, Trip, Earning
from .serializers import DriverSerializer , UserRegistrationSerializer
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
from django.db.models import Sum
from django.utils import timezone
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
# Create your views here.


from rest_framework.views import APIView
from rest_framework.response import Response


#Test Frontend
class ExampleView(APIView):
    def get(self, request):
        data = {"message": "Hello from Django!"}
        return Response(data)
    
class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


# User Logout
class LogoutView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"detail": "Refresh token not found."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

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
        # Retrieve 'type' parameter from request (default to 'total')
        stat_type = request.query_params.get("type", "total")
        today = timezone.now().date()
        
        if stat_type == "daily":
            trip_counts = self.get_daily_statistics(today)
        elif stat_type == "total":
            trip_counts = self.get_cumulative_statistics()
        else:
            return Response({"error": "Invalid type. Choose 'total' or 'daily'."}, status=400)
        
        return Response(trip_counts)

    def get_cumulative_statistics(self):
        return {
            "total_trips": Trip.objects.count(),
            "in_process_trips": Trip.objects.filter(status="IN_PROCESS").count(),
            "canceled_trips": Trip.objects.filter(status="CANCELED").count(),
            "completed_trips": Trip.objects.filter(status="COMPLETED").count(),
        }

    def get_daily_statistics(self, date):
        daily_stats = (
            Trip.objects.filter(start_time__date=date)
            .values("status")
            .annotate(count=Count("id"))
        )
        
        return {
            "total_trips": sum(item["count"] for item in daily_stats),
            "in_process_trips": self.get_status_count(daily_stats, "IN_PROCESS"),
            "canceled_trips": self.get_status_count(daily_stats, "CANCELED"),
            "completed_trips": self.get_status_count(daily_stats, "COMPLETED"),
        }

    def get_status_count(self, stats, status):
        return next((item["count"] for item in stats if item["status"] == status), 0)



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