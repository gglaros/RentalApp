import logging
from contextlib import contextmanager

from sqlalchemy.orm import sessionmaker, scoped_session

from app.database.db.engine import engine

logger = logging.getLogger(__name__)

SessionLocalFactory = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Session = scoped_session(SessionLocalFactory)

_COMMIT_HOOKS = "on_commit_hooks"
_ROLLBACK_HOOKS = "on_rollback_hooks"


def get_session():
    return Session


def remove_scoped_session():
    Session.remove()


def on_commit(callback) -> None:
    Session().info.setdefault(_COMMIT_HOOKS, []).append(callback)


def on_rollback(callback) -> None:
    Session().info.setdefault(_ROLLBACK_HOOKS, []).append(callback)


def _run_hooks(session, key: str) -> None:
    hooks = session.info.pop(key, [])
    for hook in hooks:
        try:
            hook()
        except Exception:
            logger.exception("Transaction hook failed")


def _clear_hooks(session) -> None:
    session.info.pop(_COMMIT_HOOKS, None)
    session.info.pop(_ROLLBACK_HOOKS, None)


@contextmanager
def session_scope():
    session = Session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        _run_hooks(session, _ROLLBACK_HOOKS)
        _clear_hooks(session)
        raise
    else:
        session.info.pop(_ROLLBACK_HOOKS, None)
        _run_hooks(session, _COMMIT_HOOKS)
