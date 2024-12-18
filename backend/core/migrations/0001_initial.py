# Generated by Django 5.1.2 on 2024-10-27 13:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Driver',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('status', models.CharField(choices=[('AVAILABLE', 'Available'), ('NOT_AVAILABLE', 'Not Available'), ('WAY_TO_PICKUP', 'Way to Pick Up'), ('REACHED_PICKUP', 'Reached Pickup'), ('WAY_TO_DROPOFF', 'Way to Drop Off')], default='AVAILABLE', max_length=20)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-updated_at'],
            },
        ),
        migrations.CreateModel(
            name='Trip',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('IN_PROCESS', 'In Process'), ('COMPLETED', 'Completed'), ('CANCELED', 'Canceled')], max_length=20)),
                ('pickup_location', models.CharField(max_length=255)),
                ('dropoff_location', models.CharField(max_length=255)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField(blank=True, null=True)),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trips', to='core.driver')),
            ],
        ),
        migrations.CreateModel(
            name='Earning',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('trip', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='earning', to='core.trip')),
            ],
        ),
    ]
