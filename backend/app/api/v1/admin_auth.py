"""
Authentication endpoints for admin login (no public signup path).
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.db.session import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    revoke_refresh_token,
    decode_token,
)
from app.models.user import User, RoleEnum
from app.schemas.user import Token

router = APIRouter()


@router.post("/login", response_model=Token)
def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate admin and issue tokens.
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Ensure the user is an admin (for this endpoint)
    if user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for admin accounts only",
        )

    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role.value}
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role.value},
        db_session=db
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }