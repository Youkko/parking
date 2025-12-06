from flask.cli import with_appcontext
from app import db
from app.models import Price
import click

@click.command('seed-prices')
@with_appcontext
def seed_prices():
  if Price.query.first():
    click.echo("Prices table already has data.")
    return

  default_prices = [
    Price(description="Unregistered vehicle", grace=0, value_hour=10.00, value_fraction=5.00, value_day=100.00),
    Price(description="Registered car", grace=10, value_hour=5.00, value_fraction=0.00, value_day=50.00),
    Price(description="Registered motorcycle", grace=10, value_hour=2.50, value_fraction=0.00, value_day=25.00),
  ]
  db.session.add_all(default_prices)
  db.session.commit()
  click.echo("Default prices inserted.")