FROM mcr.microsoft.com/playwright/python:v1.63.0-noble

WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app

ENV ERP_DATA_DIR=/var/data ERP_COOKIE_SECURE=1 PYTHONUNBUFFERED=1
CMD ["sh", "-c", "exec gunicorn --workers 1 --threads 4 --bind 0.0.0.0:${PORT:-10000} wsgi:app"]
