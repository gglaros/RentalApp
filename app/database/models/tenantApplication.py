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
    

class TenantApplication(Base):
    __tablename__ ="tenant_applications"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus, native_enum=False),nullable=False,default=ApplicationStatus.PENDING )
    
    property_id: Mapped[int] = mapped_column( ForeignKey("properties.id", ondelete="CASCADE"),  nullable=False,  index=True, )
    tenant_id: Mapped[int] = mapped_column( ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True, )
    
    property: Mapped["Property"] = relationship( "Property", back_populates="tenant_applications",foreign_keys="[TenantApplication.property_id]")
    tenant: Mapped["User"] = relationship( "User", back_populates="tenant_applications", foreign_keys="[TenantApplication.tenant_id]")
    
    
    __table__args__ = (
        UniqueConstraint("tenant_id", "property_id", name="uq_tenant_property_application"),
        ForeignKeyConstraint(["tenant_id"], ["users.id"], ondelete="CASCADE"),
        
        ForeignKeyConstraint(["property_id", "tenant_id"],["properties.id", "properties.owner_id"], name="fk_tenant_app_property_owner", ondelete="CASCADE", ),
        Index("ix_tenant_apps_tenant_property", "tenant_id", "property_id"),
    )