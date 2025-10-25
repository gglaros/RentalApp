# app/db/engine.py
"""
Δημιουργεί το SQLAlchemy Engine.
Χρησιμοποιούμε pure SQLAlchemy 2.0 (όχι Flask-SQLAlchemy).
"""

from sqlalchemy import create_engine

# --- Επιλογή βάσης ---
# SQLite (local file)
DATABASE_URL = "sqlite:///./rental.db"

# Αν θέλεις PostgreSQL:
# DATABASE_URL = "postgresql+psycopg2://user:password@localhost:5432/rental_db"

# Αν θέλεις MySQL:
# DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/rental_db"

# --- Δημιουργία engine ---
engine = create_engine(
    DATABASE_URL,
    echo=True,        # δείχνει τα SQL queries στο terminal (για debug)
    future=True,      # χρησιμοποιεί το νέο 2.0 style API
)
