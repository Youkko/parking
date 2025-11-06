FROM python:3.14-slim

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_CREATE=false

RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential libpq-dev netcat-traditional gcc \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN useradd --create-home appuser && chown -R appuser:appuser /usr/src/app
USER appuser

ENV PATH="/home/appuser/.local/bin:${PATH}"

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]