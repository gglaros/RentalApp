# exceptions.py

class NotFoundError(Exception):
    """Raised when a resource is not found (→ 404)."""
    pass

class BadRequestError(Exception):
    """Raised for business validation errors (→ 400)."""
    pass

class UnauthorizedError(Exception):
    """Raised when auth fails (→ 401)."""
    pass

class ConflictError(Exception): ...
