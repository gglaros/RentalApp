import os
import logging
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import URL

load_dotenv()

logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parent.parent

_DEV_SECRET = "dev-only-insecure-secret-change-me"


def _bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _list(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


def _database_url():
    if os.getenv("DATABASE_URL"):
        return os.environ["DATABASE_URL"]

    missing = [v for v in ("POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB") if not os.getenv(v)]
    if missing:
        raise RuntimeError(
            f"Missing database settings: {', '.join(missing)}. "
            "Set them in .env (or set DATABASE_URL)."
        )

    return URL.create(
        "postgresql+psycopg2",
        username=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"],
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        database=os.environ["POSTGRES_DB"],
    )


class Settings:
    def __init__(self):
        self.ENV = os.getenv("APP_ENV", "development")
        self.DEBUG = _bool("FLASK_DEBUG", self.ENV == "development")
        self.HOST = os.getenv("HOST", "0.0.0.0")
        self.PORT = int(os.getenv("PORT", "5000"))

        self.DATABASE_URL = _database_url()
        self.SQL_ECHO = _bool("SQL_ECHO", False)

        self.SECRET_KEY = os.getenv("SECRET_KEY") or self._dev_secret()
        self.JWT_ALGORITHM = "HS256"
        self.JWT_EXPIRES = timedelta(minutes=int(os.getenv("JWT_EXPIRES_MINUTES", "60")))

        self.CORS_ORIGINS = _list(
            "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
        )

        self.UPLOAD_FOLDER = os.getenv(
            "UPLOAD_FOLDER", str(BACKEND_DIR / "uploads" / "properties")
        )
        self.MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_MB", "50")) * 1024 * 1024

    def _dev_secret(self) -> str:
        if self.ENV == "production":
            raise RuntimeError("SECRET_KEY must be set in production.")
        logger.warning("SECRET_KEY is not set: using an insecure development key.")
        return _DEV_SECRET


settings = Settings()
