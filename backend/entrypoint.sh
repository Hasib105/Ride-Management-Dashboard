#!/bin/bash

# Run database migrations
echo "Running database migrations..."
pipenv run python manage.py migrate

# Seed the database (only if necessary)
if [ "$1" == "seed" ]; then
    echo "Seeding the database..."
    pipenv run python manage.py seed
else
    echo "Skipping database seeding."
fi

# Collect static files
echo "Collecting static files..."
pipenv run python manage.py collectstatic --noinput

# Start the Django application
echo "Starting the Django application..."
exec "$@"