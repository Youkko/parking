# Binder's Parking project

Welcome.

This is a small demo for a parking lot management system, which has (or will have) the following features:

* Account creation and authentication
* Vehicle access control and billing
* Gemma AI-driven chatbot

## Techincal Characteristics

**Note:** This is still a work in progress.

This solution has a web api created in Python + Flask, and uses SQLAlchemy + Flask-Migrate + Psycopg to access and seed a Postgres database.

The API's authentication is done using Flask JWT Extended + Argon2 for password hashing.

### Setup

First, you must create a .env file inside **/api** folder, with the following structure:

```shell
DATABASE_URL=postgresql+psycopg://your-username:your-password@db:5432/your-database-name
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
JWT_SECRET_KEY=insert-a-super-secure-secret-for-your-tokens-here
FLASK_APP=app/manage.py
FLASK_ENV=production
```

**Note:** your database connection info here should match the ones on db section inside docker-compose.yml file. The SQL_HOST variable should not be changed, since it's referring to docker's database hosting image.
