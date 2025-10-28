from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Enum, DateTime, Integer,ForeignKey
from datetime import datetime
import enum
from app.database.db.base import Base

if TYPE_CHECKING:
    from app.database.models.property import Property
    from app.database.models.users import User

class ApplicationStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
   

class OwnerApplication(Base):
    __tablename__ = "owner_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, native_enum=False),
        nullable=False,
        default=ApplicationStatus.PENDING
    )



    property_id: Mapped[int] = mapped_column(
        ForeignKey("properties.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )


    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="owner_applications",
    )
    owner: Mapped["User"] = relationship(
        "User",
        back_populates="owner_applications",
    )
