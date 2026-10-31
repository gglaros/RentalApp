import logging

from sqlalchemy import inspect, text

logger = logging.getLogger(__name__)


def apply_schema_updates(engine) -> None:
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    if "property_images" in tables:
        columns = {c["name"] for c in inspector.get_columns("property_images")}
        if "status" not in columns:
            with engine.begin() as conn:
                conn.execute(text(
                    "ALTER TABLE property_images "
                    "ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'APPROVED'"
                ))
                conn.execute(text(
                    "CREATE INDEX IF NOT EXISTS ix_property_images_status ON property_images (status)"
                ))
            logger.warning("Added column property_images.status (existing photos marked APPROVED)")
