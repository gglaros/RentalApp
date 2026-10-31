import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename
from app.common.exceptions import BadRequestError

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_IMAGES_PER_PROPERTY = 10

PUBLIC_PREFIX = "uploads/properties"


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def _upload_folder() -> str:
    folder = current_app.config["PROPERTY_UPLOAD_FOLDER"]
    os.makedirs(folder, exist_ok=True)
    return folder


def validate_files(files) -> list:
    valid = [f for f in files if f and f.filename]
    for f in valid:
        if not allowed_file(f.filename):
            raise BadRequestError(
                f"Invalid image type: {f.filename}. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )
    return valid


def save_files(files) -> list[str]:
    folder = _upload_folder()
    saved = []
    try:
        for f in files:
            ext = f.filename.rsplit(".", 1)[1].lower()
            filename = secure_filename(f"{uuid.uuid4().hex}.{ext}")
            f.save(os.path.join(folder, filename))
            saved.append(f"{PUBLIC_PREFIX}/{filename}")
    except Exception:
        delete_files(saved)
        raise
    return saved


def delete_files(paths) -> None:
    folder = current_app.config["PROPERTY_UPLOAD_FOLDER"]
    for path in paths:
        if not path:
            continue
        filename = os.path.basename(path)
        full = os.path.join(folder, filename)
        try:
            if os.path.isfile(full):
                os.remove(full)
        except OSError as e:
            current_app.logger.warning(f"Could not delete image {full}: {e}")
