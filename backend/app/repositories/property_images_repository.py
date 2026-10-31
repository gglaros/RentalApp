from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.database.models.property import Property
from app.database.models.propertyImage import PropertyImage, ImageStatus


class PropertyImagesRepository:
    def __init__(self, session):
        self.session = session

    def get(self, image_id: int) -> PropertyImage | None:
        return self.session.get(PropertyImage, image_id)

    def list_by_property(self, prop_id: int) -> list[PropertyImage]:
        stmt = (
            select(PropertyImage)
            .where(PropertyImage.property_id == prop_id)
            .order_by(PropertyImage.position, PropertyImage.id)
        )
        return list(self.session.scalars(stmt).all())

    def list_pending(self, limit=100) -> list[PropertyImage]:
        stmt = (
            select(PropertyImage)
            .where(PropertyImage.status == ImageStatus.PENDING)
            .options(joinedload(PropertyImage.property).joinedload(Property.owner))
            .order_by(PropertyImage.created_at, PropertyImage.id)
            .limit(limit)
        )
        return list(self.session.scalars(stmt).all())

    def add(self, prop_id: int, path: str, position: int, status: str = ImageStatus.PENDING) -> PropertyImage:
        img = PropertyImage(property_id=prop_id, path=path, position=position, status=status)
        self.session.add(img)
        self.session.flush()
        return img

    def delete(self, img: PropertyImage) -> None:
        self.session.delete(img)
        self.session.flush()
