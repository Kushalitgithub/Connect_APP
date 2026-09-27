"""
Authentication endpoints for tourist signup and login.
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
from app.schemas.user import UserCreate, User as UserSchema, Token
from app.core.dependencies import get_current_tourist

router = APIRouter()


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def tourist_signup(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new tourist account.
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new tourist user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=RoleEnum.tourist,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access and refresh tokens
    access_token_expires = timedelta(minutes=15)  # from settings, but we can import
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


@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_tourist)):
    """
    Get current user's information.
    """
    return current_user


@router.post("/login", response_model=Token)
def tourist_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticate tourist and issue tokens.
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
    # Ensure the user is a tourist (for this endpoint)
    if user.role != RoleEnum.tourist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for tourist accounts only",
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