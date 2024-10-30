# Use Python 3.12 as the base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Set the working directory
WORKDIR /app

# Install Pipenv
RUN pip install --no-cache-dir pipenv

# Copy Pipfile and Pipfile.lock first for better caching
COPY Pipfile ./


# Install dependencies using Pipenv
RUN pipenv install --deploy --ignore-pipfile

# Copy the rest of the application code
COPY . .

# Copy the .env file (if necessary)
COPY .env ./

# Copy the entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Give permission to execute the entrypoint script
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 8000 for the Django app
EXPOSE 8000

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start the application using Gunicorn
CMD ["pipenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]