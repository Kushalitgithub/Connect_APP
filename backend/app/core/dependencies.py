"""
Core dependencies for authentication and authorization.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from typing import Optional

from app.db.session import get_db
from app.core.security import decode_token
from app.models.user import User, RoleEnum

# OAuth2 scheme for extracting token from Authorization header
# Using a generic tokenUrl since we have multiple login endpoints
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.
    Returns the User object if token is valid, raises HTTPException otherwise.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: Optional[int] = payload.get("user_id")
        email: Optional[str] = payload.get("sub")
        role: Optional[str] = payload.get("role")
        if user_id is None or email is None or role is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    # Additional checks: user active, role matches token (defense in depth)
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    if user.role.value != role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Role mismatch in token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to get the current active user.
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_user_role_required(required_role: RoleEnum):
    """
    Dependency factory to require a specific role.
    Returns a dependency that checks the user's role.
    """
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role {current_user.role.value}",
            )
        return current_user
    return role_checker


# Common role dependencies
get_current_tourist = get_user_role_required(RoleEnum.tourist)
get_current_guide = get_user_role_required(RoleEnum.guide)
get_current_admin = get_user_role_required(RoleEnum.admin)