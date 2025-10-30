from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKeyConstraint, Index, String, Boolean, Enum, DateTime, Integer,ForeignKey, UniqueConstraint
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
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus, native_enum=False),nullable=False,default=ApplicationStatus.PENDING )

    property_id: Mapped[int] = mapped_column( ForeignKey("properties.id", ondelete="CASCADE"),  nullable=False,  index=True, )
    owner_id: Mapped[int] = mapped_column( ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True, )

   
    property: Mapped["Property"] = relationship( "Property", back_populates="owner_applications",foreign_keys="[OwnerApplication.property_id]")
    owner: Mapped["User"] = relationship( "User", back_populates="owner_applications", foreign_keys="[OwnerApplication.owner_id]")
    
    
    __table_args__ = (
        UniqueConstraint("owner_id", "property_id", name="uq_owner_property_application"),
        ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        
        ForeignKeyConstraint(["property_id", "owner_id"],["properties.id", "properties.owner_id"], name="fk_app_property_owner", ondelete="CASCADE", ),
        Index("ix_owner_apps_owner_property", "owner_id", "property_id"),
    )


