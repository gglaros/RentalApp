import io
import os

from app.config import settings


def image(name="photo.jpg"):
    return (io.BytesIO(b"fake-image-bytes"), name)


def uploads():
    return os.listdir(settings.UPLOAD_FOLDER)
