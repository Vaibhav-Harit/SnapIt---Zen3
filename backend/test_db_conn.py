import os
import environ
import psycopg2
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

try:
    conn = psycopg2.connect(env('DATABASE_URL'))
    print("Database connection successful")
    conn.close()
except Exception as e:
    print(f"Database connection failed: {e}")
