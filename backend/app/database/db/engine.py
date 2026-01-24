from sqlite3 import Connection as SQLite3Connection
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from pathlib import Path
import os



# import os
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

# POSTGRES_USER = os.getenv("POSTGRES_USER")
# POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
# POSTGRES_DB = os.getenv("POSTGRES_DB")
# POSTGRES_HOST = os.getenv("POSTGRES_HOST")
# POSTGRES_PORT = os.getenv("POSTGRES_PORT")

# SQLALCHEMY_DATABASE_URL = (
#     f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
# )

# engine = create_engine(SQLALCHEMY_DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


DATABASE_URL = "sqlite:////home/giorgos/Documents/projects/rentalApp/backend/rental.db"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    future=True,
)

@event.listens_for(Engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()
