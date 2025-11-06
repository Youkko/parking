FROM python:3.14.0
WORKDIR /usr/src/app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y build-essential libpq-dev python3-dev netcat-traditional gcc
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY ./app ./app
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]