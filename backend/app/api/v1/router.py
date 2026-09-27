"""
API router for version 1.
"""
from fastapi import APIRouter
from app.api.v1 import auth, guide_auth, admin_auth, refresh

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth/tourist", tags=["tourist-auth"])
api_router.include_router(guide_auth.router, prefix="/auth/guide", tags=["guide-auth"])
api_router.include_router(admin_auth.router, prefix="/auth/admin", tags=["admin-auth"])
api_router.include_router(refresh.router, prefix="/auth", tags=["auth-refresh"])