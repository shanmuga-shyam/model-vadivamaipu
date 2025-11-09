from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os
import sys

# ----------------------------------------------------------------------
# 1️⃣ Add server/ to Python path (so imports work no matter where you run Alembic)
# ----------------------------------------------------------------------
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

# ----------------------------------------------------------------------
# 2️⃣ Import Base and all models here
# ----------------------------------------------------------------------
from core.database import Base
from models import user_model, data_models

# ----------------------------------------------------------------------
# 3️⃣ Alembic Config setup
# ----------------------------------------------------------------------
config = context.config
fileConfig(config.config_file_name)

# Tell Alembic which metadata to target for autogeneration
target_metadata = Base.metadata

# ----------------------------------------------------------------------
# 4️⃣ Migration Functions
# ----------------------------------------------------------------------

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


# ----------------------------------------------------------------------
# 5️⃣ Run either offline or online migrations
# ----------------------------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
