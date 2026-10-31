import logging
from app.database.models.property import Property
from app.database.models.propertyImage import ImageStatus
from app.repositories.properties_repository import PropertiesRepository
from app.repositories.property_images_repository import PropertyImagesRepository
from app.repositories.users_repository import UsersRepository
from app.common.exceptions import NotFoundError,BadRequestError,ConflictError, ForbiddenError
from app.validation.property_validation import PropertyValidation
from app.database.models.users import Role
from app.database.db.session import get_session, on_commit, on_rollback
from app.services import image_storage

logger = logging.getLogger(__name__)

class PropertiesService:
    def __init__(self):
        self.session = get_session()
        self.repo = PropertiesRepository(get_session() )
        self.users = UsersRepository(get_session())
        self.images = PropertyImagesRepository(get_session())

    def create(self, userAuth, files=None, **data) -> Property:

        user=self.users.get(userAuth.id)

        if not user:
         raise NotFoundError("Owner not found")

        if user.role != Role.OWNER:
         raise BadRequestError("Only users with OWNER role can create properties")

        existing = self.repo.find_by_address_and_unit(data["address"], data["unit_number"])

        if existing:
            if existing.owner_id != user.id:
                raise ConflictError("This property already exists and is owned by another user.")
            else:
                raise ConflictError("You already own this property.")

        files = image_storage.validate_files(files or [])
        if len(files) > image_storage.MAX_IMAGES_PER_PROPERTY:
            raise BadRequestError(f"You can upload up to {image_storage.MAX_IMAGES_PER_PROPERTY} images per property")

        data["owner_id"] = user.id
        data["status"] = "PENDING"
        data.pop("image", None)
        prop = Property(**data)
        self.repo.create(prop)
        logger.info("Owner %s created property %s", user.id, prop.id)

        if files:
            paths = image_storage.save_files(files)
            on_rollback(lambda: image_storage.delete_files(paths))
            for pos, path in enumerate(paths):
                self.images.add(prop.id, path, pos)
            self._sync_cover(prop)
        return prop


    def get(self, prop_id: int,userAuth):
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")

        is_owner = userAuth is not None and prop.owner_id == userAuth.id
        is_admin = userAuth is not None and userAuth.role == Role.ADMIN
        if prop.status != "APPROVED" and not (is_owner or is_admin):
            raise NotFoundError(f"Property {prop_id} not found")

        if is_owner:
            self._migrate_legacy_image(prop)
        return prop


    def get_public(self, prop_id: int):
        prop = self.repo.get(prop_id)
        if not prop or prop.status != "APPROVED":
            raise NotFoundError(f"Property {prop_id} not found")
        return prop


    def list_all(self,) -> list[Property]:
        return self.repo.list_all()


    def get_approved_properties(self, **filters) -> list[Property]:
        return self.repo.search_approved(**filters)


    def list_by_owner(self, owner_id: int,userAuth) -> list[Property]:

        user=self.users.get(userAuth.id)
        owner=self.users.get(owner_id)

        if not user or not owner:
         raise NotFoundError("user or owner not found")

        if owner_id != userAuth.id and user.role != Role.ADMIN:
         raise BadRequestError("You do not have permission to view these properties")

        return self.repo.list_by_owner(owner_id)


    def update(self, prop_id: int, user,**fields) -> Property:

        PropertyValidation.check_property_exists(self,prop_id)
        prop = self.repo.get(prop_id)
        if prop.owner_id != user.id:
         raise BadRequestError("You do not have permission to update this property")

        protected = {"id", "owner_id", "updated_at", "status", "image"}
        for k in list(fields.keys()):
         if k in protected or fields[k] is None:
            fields.pop(k, None)

        new_address = fields.get("address", prop.address)
        new_unit = fields.get("unit_number", prop.unit_number)
        existing = self.repo.find_by_address_and_unit(new_address, new_unit)
        if existing and existing.id != prop.id:
            raise ConflictError("Another property with this address and unit number already exists")

        updated_prop = self.repo.update(prop_id, **fields)
        return updated_prop


    def delete(self, prop_id: int, user) -> None:
        prop = self.repo.get(prop_id)
        if not prop:
         raise NotFoundError(f"Property {prop_id} not found")

        if prop.owner_id != user.id and user.role != Role.ADMIN:
         raise BadRequestError("You do not have permission to delete this property")

        paths = [img.path for img in prop.images]
        if prop.image:
            paths.append(prop.image)

        self.repo.delete(prop)
        logger.info("User %s deleted property %s", user.id, prop_id)
        on_commit(lambda: image_storage.delete_files(set(paths)))
        return {"message": "Property deleted"}


    def _get_owned_property(self, prop_id: int, user) -> Property:
        prop = self.repo.get(prop_id)
        if not prop:
            raise NotFoundError(f"Property {prop_id} not found")
        if prop.owner_id != user.id and user.role != Role.ADMIN:
            raise ForbiddenError("You do not have permission to change the images of this property")
        self._migrate_legacy_image(prop)
        return prop


    def _migrate_legacy_image(self, prop: Property) -> None:
        if prop.image and not prop.images:
            self.images.add(prop.id, prop.image, 0, status=ImageStatus.APPROVED)
            self.session.refresh(prop)


    def _sync_cover(self, prop: Property) -> None:
        self.session.refresh(prop)
        for pos, img in enumerate(prop.images):
            img.position = pos
        approved = [img for img in prop.images if img.status == ImageStatus.APPROVED]
        prop.image = approved[0].path if approved else None
        self.session.flush()


    def add_images(self, prop_id: int, user, files) -> Property:
        prop = self._get_owned_property(prop_id, user)

        files = image_storage.validate_files(files or [])
        if not files:
            raise BadRequestError("No images were sent (use the field name 'images')")

        if len(prop.images) + len(files) > image_storage.MAX_IMAGES_PER_PROPERTY:
            raise BadRequestError(
                f"A property can have up to {image_storage.MAX_IMAGES_PER_PROPERTY} images "
                f"(it already has {len(prop.images)})"
            )

        paths = image_storage.save_files(files)
        on_rollback(lambda: image_storage.delete_files(paths))
        start = len(prop.images)
        for i, path in enumerate(paths):
            self.images.add(prop.id, path, start + i)
        self._sync_cover(prop)
        return prop


    def delete_image(self, prop_id: int, image_id: int, user) -> Property:
        prop = self._get_owned_property(prop_id, user)
        img = self.images.get(image_id)
        if not img or img.property_id != prop.id:
            raise NotFoundError(f"Image {image_id} not found for property {prop_id}")

        path = img.path
        self.images.delete(img)
        self._sync_cover(prop)
        on_commit(lambda: image_storage.delete_files([path]))
        return prop


    def set_cover(self, prop_id: int, image_id: int, user) -> Property:
        prop = self._get_owned_property(prop_id, user)
        img = self.images.get(image_id)
        if not img or img.property_id != prop.id:
            raise NotFoundError(f"Image {image_id} not found for property {prop_id}")
        if img.status != ImageStatus.APPROVED:
            raise BadRequestError("Only approved photos can be the cover photo")

        others = [i for i in prop.images if i.id != img.id]
        for pos, i in enumerate([img] + others):
            i.position = pos
        self.session.flush()
        self._sync_cover(prop)
        return prop


    def list_pending_images(self):
        return self.images.list_pending()


    def review_image(self, image_id: int, status: str, admin) -> dict:
        img = self.images.get(image_id)
        if not img:
            raise NotFoundError(f"Image {image_id} not found")
        prop = img.property

        if status == ImageStatus.APPROVED:
            img.status = ImageStatus.APPROVED
            self.session.flush()
            self._sync_cover(prop)
            logger.info("Admin %s approved image %s of property %s", admin.id, image_id, prop.id)
            return {"image_id": image_id, "status": ImageStatus.APPROVED}

        path = img.path
        self.images.delete(img)
        self._sync_cover(prop)
        on_commit(lambda: image_storage.delete_files([path]))
        logger.info("Admin %s rejected (deleted) image %s of property %s", admin.id, image_id, prop.id)
        return {"image_id": image_id, "status": "REJECTED", "deleted": True}
