#!/usr/bin/env sh
set -e

if [ -f .env ]; then
  # shellcheck disable=SC1091
  export $(grep -v '^#' .env | xargs)
fi

echo "Starting entrypoint for Flask app"

# Wait for Postgres to become available
if [ "${DATABASE}" = "postgres" ]; then
  echo "Waiting for postgres at ${SQL_HOST}:${SQL_PORT}..."
  TIMEOUT=30
  until nc -z "${SQL_HOST}" "${SQL_PORT}" || [ $TIMEOUT -le 0 ]; do
    printf '.'
    sleep 1
    TIMEOUT=$((TIMEOUT - 1))
  done
  if [ $TIMEOUT -le 0 ]; then
    echo "Postgres not available after timeout" >&2
    exit 1
  fi
  echo "Postgres is ready"
fi

if [ ! -d "migrations" ]; then
  echo "Initializing Flask-Migrate (first run)..."
  flask db init
fi

echo "Generating migration scripts if needed..."
flask db migrate -m "auto migration" || echo "No new changes detected."

echo "Applying database migrations..."
flask db upgrade || {
  echo "Migration failed; database may be in use."
}

echo "Database is up to date."

echo "Launching Flask app..."
exec "$@"