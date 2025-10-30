# app/api/errors.py
from flask import jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from app.common.exceptions import NotFoundError, BadRequestError, ConflictError
from werkzeug.exceptions import BadRequest,NotFound,MethodNotAllowed
from werkzeug.exceptions import HTTPException
import os




def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation(e):
        return jsonify({"errors": e.messages}), 400
    
    

    @app.errorhandler(MethodNotAllowed)
    def handle_method_not_allowed(e):
     return jsonify({"error": "Method not allowed for this endpoint"}), 405


    @app.errorhandler(NotFoundError)
    def handle_nf(e):
        return jsonify({"error": str(e)}), 404
    
    
    @app.errorhandler(NotFound)
    def handle_flask_not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(BadRequest)
    def handle_flask_bad_request(e):
        return jsonify({"error": "Invalid request – check your parameters"}), 400
    

    @app.errorhandler(BadRequestError)
    def handle_br(e):
        return jsonify({"error": str(e)}), 400

    @app.errorhandler(ConflictError)
    def handle_conflict(e):
        return jsonify({"error": str(e)}), 409

    @app.errorhandler(IntegrityError)
    def handle_integrity(e):
        app.logger.debug(f"IntegrityError: {repr(e)}")
        domain_exc = translate_integrity_error(e)

        if isinstance(domain_exc, NotFoundError):
            return jsonify({"error": str(domain_exc)}), 404
        if isinstance(domain_exc, BadRequestError):
            return jsonify({"error": str(domain_exc)}), 400
        if isinstance(domain_exc, ConflictError):
            return jsonify({"error": str(domain_exc)}), 409

        return jsonify({"error": "Integrity constraint violated"}), 409


def translate_integrity_error(err: IntegrityError) -> Exception:
  
    orig = getattr(err, "orig", None)
    diag = getattr(orig, "diag", None)
    constraint = getattr(diag, "constraint_name", None)
    pgcode = getattr(orig, "pgcode", None)
    msg = str(orig) if orig else str(err)
 



    # Email unique
    if ("UNIQUE constraint failed: users.email" in msg) or \
       ("Duplicate entry" in msg and ("for key 'users.email'" in msg or "for key 'uq_users_email'" in msg)):
        return ConflictError("Email already in use re papara piasto sto service.")


    # Foreign key
    if "FOREIGN KEY constraint failed" in msg or "a foreign key constraint fails" in msg:
        return NotFoundError("Related entity not found (foreign key violation).")
    
   
    
    # --- Fallbacks για SQLite ---
    if "UNIQUE constraint failed: properties.address, properties.unit_number" in msg:
     return ConflictError("Property with this address and unit number already exists papara piasto sto serivce.")
  
    if "UNIQUE constraint failed: ownerApplication.owner_id, ownerApplication.property_id" in msg:
     return ConflictError("ownerapplication with this owner_id and property_id  already exists papara piasto sto serivce.")


    # Γενικό fallback
    return ConflictError("Integrity constraint violated.")
