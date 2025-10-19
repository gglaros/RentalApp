
# app/api/errors.py
from flask import jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from app.common.exceptions import NotFoundError, BadRequestError, ConflictError

def register_error_handlers(app):
    @app.errorhandler(ValidationError)
    def handle_validation(e):
        return jsonify({"errors": e.messages}), 400

    @app.errorhandler(NotFoundError)
    def handle_nf(e):
        return jsonify({"error": str(e)}), 404

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

  
    if pgcode == "23505":
        # Property unique: (owner_id, address, unit_number)
        if constraint == "uq_address_unit":
            return ConflictError("Property already exists for this owner (address, unit_number).")
        # Users.email unique (προσαρμόσ’ το στο δικό σου όνομα constraint)
        if constraint in {"users_email_key", "uq_users_email"}:
            return ConflictError("Email already in use.")
        return ConflictError("Duplicate value violates a unique constraint.")
        
    # 23503: foreign_key_violation
    if pgcode == "23503":
        # Π.χ. properties.owner_id FK
        if constraint in {"properties_owner_id_fkey"}:
            return NotFoundError("Owner does not exist.")
        return NotFoundError("Related entity not found (foreign key violation).")

    # 23502: not_null_violation, 23514: check_violation
    if pgcode in {"23502", "23514"}:
        return BadRequestError("Invalid or missing data for a required field.")

   



    # Email unique
    if ("UNIQUE constraint failed: users.email" in msg) or \
       ("Duplicate entry" in msg and ("for key 'users.email'" in msg or "for key 'uq_users_email'" in msg)):
        return ConflictError("Email already in use.")

    # Foreign key
    if "FOREIGN KEY constraint failed" in msg or "a foreign key constraint fails" in msg:
        return NotFoundError("Related entity not found (foreign key violation).")
    
    # --- Fallbacks για SQLite ---
    if "UNIQUE constraint failed: properties.address, properties.unit_number" in msg:
     return ConflictError("Property with this address and unit number already exists.")


    # Γενικό fallback
    return ConflictError("Integrity constraint violated.")
