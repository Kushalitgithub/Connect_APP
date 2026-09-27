"""
Security utilities for password hashing and JWT token handling.
"""
from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
from app.models.user import User, RoleEnum
from app.models.refresh_token import RefreshToken

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, db_session) -> str:
    """
    Create a JWT refresh token and store its hash in the database.
    Returns the plain token (only shown once).
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    # Hash the token for storage
    token_hash = get_password_hash(encoded_jwt)

    # Store the hash in the database
    refresh_token_entry = RefreshToken(
        user_id=data["user_id"],
        token_hash=token_hash,
        expires_at=expire
    )
    db_session.add(refresh_token_entry)
    db_session.commit()

    return encoded_jwt

def verify_refresh_token(token: str, db_session) -> bool:
    """
    Verify a refresh token: check if it exists in the database, is not expired, and not revoked.
    """
    try:
        payload = decode_token(token)
        # We don't need to check the expiration here because we store the expiration in the database
        # and we will check it below.
    except JWTError:
        return False

    # Hash the token to compare with stored hash
    token_hash = get_password_hash(token)

    # Find the token in the database
    stored_token = db_session.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash,
        RefreshToken.revoked == False
    ).first()

    if not stored_token:
        return False

    # Check if expired
    if stored_token.expires_at < datetime.utcnow():
        return False

    return True

def revoke_refresh_token(token: str, db_session) -> bool:
    """
    Revoke a refresh token by setting its revoked flag to True.
    """
    try:
        payload = decode_token(token)
    except JWTError:
        return False

    token_hash = get_password_hash(token)

    stored_token = db_session.query(RefreshToken).filter(
        RefreshToken.token_hash == token_hash
    ).first()

    if not stored_token:
        return False

    stored_token.revoked = True
    db_session.commit()
    return True

def decode_token(token: str) -> dict:
    """
    Decode a JWT token and return the payload.
    Raises JWTError if token is invalid.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

def get_user_role_from_token(token: str) -> Optional[RoleEnum]:
    """
    Extract the user role from a token.
    """
    try:
        payload = decode_token(token)
        role_str = payload.get("role")
        if role_str:
            return RoleEnum(role_str)
    except (JWTError, ValueError):
        pass
    return None