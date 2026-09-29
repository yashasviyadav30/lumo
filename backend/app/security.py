"""Passwords, session tokens and log pseudonyms."""

import hashlib
import hmac
import secrets
import uuid

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

from app.config import get_settings

_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except (VerificationError, InvalidHashError):
        return False


def new_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


_fallback_secret = secrets.token_bytes(32)


def pseudonym(user_id: uuid.UUID) -> str:
    """Stable per-user label for logs that can't be turned back into the user ID without the secret."""
    key = get_settings().secret_key.encode() or _fallback_secret
    return hmac.new(key, str(user_id).encode(), hashlib.sha256).hexdigest()[:16]
