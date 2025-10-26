# app/models/property.py
from sqlalchemy import String, Integer, ForeignKey, DateTime, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database.db.base import Base


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    address: Mapped[str] = mapped_column(String(200), nullable=True)
    unit_number: Mapped[str | None] = mapped_column(String(50), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    square_feet: Mapped[int] = mapped_column(Integer, nullable=False)
    year_built: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
        
    owner = relationship("User")


    __table_args__ = (
        UniqueConstraint( "address", "unit_number", name="uq_address_unit"),
        Index("ix_properties_owner_id", "owner_id"),
        Index("ix_properties_status", "status"),
    )