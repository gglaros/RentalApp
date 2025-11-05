from sqlite3 import Connection as SQLite3Connection
from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from pathlib import Path
import os


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
