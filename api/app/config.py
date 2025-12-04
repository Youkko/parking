import os
from datetime import timedelta

class Config:
  SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL',
    'postgresql+psycopg://hello_flask:hello_flask@db:5432/hello_flask_dev'
  )
  SQLALCHEMY_TRACK_MODIFICATIONS = False

  JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-secret')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_EXPIRES_HOURS', '24')))

  LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
  PROPAGATE_EXCEPTIONS = True

  SQLALCHEMY_ENGINE_OPTIONS = {
    'pool_pre_ping': True,
  }

  GEMMA_API_URL = os.getenv(
    'GEMMA_API_URL',
    'http://gemma:12434/engines/llama.cpp/v1/chat/completions'
  )

  GEMMA_DEFAULT_SYSTEM_PROMPT = os.getenv(
    'GEMMA_DEFAULT_SYSTEM_PROMPT',
    "You are a helpful assistant from a parking lot management system called Binder's Parking. The system has the ability to track vehicles arrival and departure times by their license plate number. Only logged-in users can register arrivals and departures, but all users can see the dashboard with parking lot movement history."
  )