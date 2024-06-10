#!/bin/sh

echo 'Running collecstatic...'
python DjangoApi/manage.py collectstatic --no-input

echo 'Applying migrations...'
python DjangoApi/manage.py wait_for_db
python DjangoApi/manage.py makemigrations
python DjangoApi/manage.py migrate
python DjangoApi/populate_data.py

echo 'Running server...'
cd DjangoApi
gunicorn --env DJANGO_SETTINGS_MODULE=DjangoApi.settings DjangoApi.wsgi:application --bind 0.0.0.0:8000