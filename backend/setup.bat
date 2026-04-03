@echo off
echo Creating virtual environment...
python -m venv venv
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate
pip install django djangorestframework psycopg2-binary requests PyGithub pinecone-client google-generativeai django-environ
echo Setup complete.
