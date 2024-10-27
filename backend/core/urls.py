# urls.py
from django.urls import path
from .import views

urlpatterns = [
    path('example/', views.ExampleView.as_view(), name='example'),  # Test endpoint
    path('driver-status-count/', views.DriverStatusCountView.as_view(), name='driver-status-count'),
    path('driver-locations/', views.DriverLocationView.as_view(), name='driver-locations'),
    path('trip-statistics/', views.TripStatisticsView.as_view(), name='trip-statistics'),
    path('earnings-report/', views.EarningsReportView.as_view(), name='earnings-report'),
]
