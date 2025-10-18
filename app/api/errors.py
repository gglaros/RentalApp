# from flask import jsonify
# from werkzeug.exceptions import HTTPException
# from app.common.exceptions import NotFoundError, BadRequestError, UnauthorizedError

# def register_error_handlers(app):
#     # business exceptions → JSON
#     @app.errorhandler(NotFoundError)
#     def handle_not_found(e):
#         return jsonify({"error": str(e)}), 404

#     @app.errorhandler(BadRequestError)
#     def handle_bad_request(e):
#         return jsonify({"error": str(e)}), 400

#     @app.errorhandler(UnauthorizedError)
#     def handle_unauthorized(e):
#         return jsonify({"error": str(e)}), 401

#     # Μετατροπή όλων των HTTPException σε JSON
#     @app.errorhandler(HTTPException)
#     def handle_http_exception(e: HTTPException):
#         payload = {"error": e.description or e.name}
#         return jsonify(payload), e.code

#     # Τελευταίο δίχτυ ασφαλείας (500) σε JSON
#     @app.errorhandler(Exception)
#     def handle_generic(e: Exception):
#         # Σε prod μπορείς να μην εμφανίζεις το str(e)
#         return jsonify({"error": "Internal Server Error"}), 500



# app/api/errors.py
from flask import jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from app.common.exceptions import NotFoundError, BadRequestError, ConflictError

def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation(e): return jsonify({"errors": e.messages}), 400

    @app.errorhandler(NotFoundError)
    def handle_nf(e): return jsonify({"error": str(e)}), 404

    @app.errorhandler(BadRequestError)
    def handle_br(e): return jsonify({"error": str(e)}), 400

    @app.errorhandler(ConflictError)
    def handle_conflict(e): return jsonify({"error": str(e)}), 409

    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        # Μην διαρρέεις raw DB μηνύματα. Δώσε καθαρό conflict.
        app.logger.debug(f"IntegrityError: {e}")  # optional για logs
        return jsonify({"error": "Email already in use"}), 409
