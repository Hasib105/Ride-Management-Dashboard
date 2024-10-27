from django.urls import path
from . import views

urlpatterns = [
    #test forntend
    path('example/', views.ExampleView.as_view(), name='example_view'),
]