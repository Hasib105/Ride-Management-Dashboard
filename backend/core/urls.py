# urls.py
from django.urls import path
from .import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='register'),  
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
    path('logout/', views.LogoutView.as_view(), name='logout'), 


    # path('example/', views.ExampleView.as_view(), name='example'),  # Test endpoint
    path('driver-status-count/', views.DriverStatusCountView.as_view(), name='driver-status-count'),
    path('driver-locations/', views.DriverLocationView.as_view(), name='driver-locations'),
    path('trip-statistics/', views.TripStatisticsView.as_view(), name='trip-statistics'),
    path('earnings-report/', views.EarningsReportView.as_view(), name='earnings-report'),
]
