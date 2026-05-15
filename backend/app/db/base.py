from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Future SQLAlchemy models should inherit from this Base.
# Alembic imports app.models in env.py so model metadata is registered for migrations.
