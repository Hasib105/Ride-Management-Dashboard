from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.

class Driver(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('NOT_AVAILABLE', 'Not Available'),
        ('WAY_TO_PICKUP', 'Way to Pick Up'),
        ('REACHED_PICKUP', 'Reached Pickup'),
        ('WAY_TO_DROPOFF', 'Way to Drop Off'),
    ]

    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-updated_at']


class Trip(models.Model):
    STATUS_CHOICES = [
        ('IN_PROCESS', 'In Process'),
        ('COMPLETED', 'Completed'),
        ('CANCELED', 'Canceled'),
    ]

    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="trips")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Trip by {self.driver.name}"
    

class Earning(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name="earning")
    date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Earnings per trip for admin

    def __str__(self):
        return f"Earning from Trip {self.trip.id} on {self.date}: {self.amount}"
    



# Signal to create an earning record when a trip is completed
@receiver(post_save, sender=Trip)
def create_admin_earning_for_completed_trip(sender, instance, created, **kwargs):
    if not created and instance.status == 'COMPLETED':
        earning_amount = 10.00  # Fixed amount for admin earnings per trip

        # Check if an earning record already exists for this trip
        if not hasattr(instance, 'earning'):
            Earning.objects.create(
                trip=instance,
                amount=earning_amount
            )