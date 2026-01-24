# app/models/users.py
from __future__ import annotations
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Enum, DateTime, Integer
from datetime import datetime
import enum
from app.database.db.base import Base
from app.database.models import ownerApplication
from app.database.models import tenantApplication

if TYPE_CHECKING:
    from app.database.models.property import Property
    from app.database.models.ownerApplication import OwnerApplication
    from app.database.models.tenantApplication import TenantApplication

class Role(enum.Enum):
    OWNER = "OWNER"
    TENANT = "TENANT"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
   
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    role: Mapped[Role] = mapped_column(Enum(Role, native_enum=False), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)

    properties: Mapped[list["property"]] = relationship(
        "Property",
        back_populates="owner",
        cascade="all, delete-orphan",  
    )
    
    owner_applications:Mapped[list["OwnerApplication"]] = relationship( 
        "OwnerApplication",
        back_populates="owner", cascade="all, delete-orphan",)
    
    
    tenant_applications:Mapped[list["TenantApplication"]] = relationship( 
        "TenantApplication",
        back_populates="tenant", cascade="all, delete-orphan",)
    
    
    tenant_applications_to_own_properties: Mapped[list["TenantApplication"]] = relationship(
        "TenantApplication",
        secondary="properties",  # συνδέεται μέσω των properties
        primaryjoin="User.id==Property.owner_id",
        secondaryjoin="Property.id==TenantApplication.property_id",
        viewonly=True,            # read-only
        backref="property_owner"
    )
