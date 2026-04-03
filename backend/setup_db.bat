@echo off
echo Activating virtual environment...
call venv\Scripts\activate

echo Creating migrations for users...
python manage.py makemigrations users

echo Creating migrations for indexer...
python manage.py makemigrations indexer

echo Applying migrations...
python manage.py migrate

echo Database setup complete.
