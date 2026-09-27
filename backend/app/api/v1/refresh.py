"""
Refresh token and logout endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.session import get_db
from app.core.security import (
    verify_refresh_token,
    revoke_refresh_token,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User
from app.schemas.user import Token

router = APIRouter()


@router.post("/refresh", response_model=Token)
def refresh_token(request: dict, db: Session = Depends(get_db)):
    """
    Refresh access token using a valid refresh token.
    Expects: {"refresh_token": "jwt_token_string"}
    """
    refresh_token = request.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    # Verify the refresh token
    if not verify_refresh_token(refresh_token, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Decode the token to get user info
    payload = decode_token(refresh_token)
    user_id = payload.get("user_id")
    email = payload.get("sub")
    role = payload.get("role")

    if not user_id or not email or not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify user still exists and is active
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create new access and refresh tokens
    access_token_expires = timedelta(minutes=15)
    new_access_token = create_access_token(
        data={"sub": email, "user_id": user_id, "role": role}
    )
    new_refresh_token = create_refresh_token(
        data={"sub": email, "user_id": user_id, "role": role},
        db_session=db
    )

    # Revoke the old refresh token
    revoke_refresh_token(refresh_token, db)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }


@router.post("/logout")
def logout(request: dict, db: Session = Depends(get_db)):
    """
    Logout by revoking the refresh token.
    Expects: {"refresh_token": "jwt_token_string"}
    """
    refresh_token = request.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refresh token is required",
        )

    # Revoke the refresh token
    if revoke_refresh_token(refresh_token, db):
        return {"message": "Successfully logged out"}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid refresh token",
        )