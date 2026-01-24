# app/api/__init__.py
from flask import Blueprint
from app.api.errors import register_error_handlers

def create_api_blueprint():
    bp = Blueprint("api", __name__)
    register_error_handlers(bp)
    return bp
