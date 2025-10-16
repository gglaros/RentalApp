from sqlalchemy.orm import sessionmaker, scoped_session
from app.db.engine import engine

SessionLocalFactory = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Session = scoped_session(SessionLocalFactory)

def get_session():
    return Session

def remove_scoped_session():
    Session.remove()
