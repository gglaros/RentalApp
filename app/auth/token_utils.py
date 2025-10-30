import time

_BLOCKLIST: dict[str, int] = {}


def _now() -> int:
    return int(time.time())


def _cleanup_expired() -> None:
   
    now = _now()
    expired = [jti for jti, exp in _BLOCKLIST.items() if exp <= now]
    for jti in expired:
        _BLOCKLIST.pop(jti, None)


def revoke_jti(jti: str, exp_epoch: int) -> None:
    
    _cleanup_expired()
    _BLOCKLIST[jti] = exp_epoch


def is_token_revoked(jti: str) -> bool:
    """
    Επιστρέφει True αν το token έχει μπει στη blocklist (ή έχει λήξει).
    """
    if not jti:
        return True
    _cleanup_expired()
    return jti in _BLOCKLIST



