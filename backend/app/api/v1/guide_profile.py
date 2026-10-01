"""
Endpoints for guide profile management and onboarding.
"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import Optional

from app.db.session import get_db
from app.models.user import User, RoleEnum
from app.models.guide_profile import GuideProfile
from app.models.verification_audit_log import VerificationAuditLog
from app.core.dependencies import get_current_guide
from app.services.storage_service import StorageService

router = APIRouter()
storage_service = StorageService()


@router.put("/me/onboarding", status_code=status.HTTP_200_OK)
async def guide_onboarding(
    bio: Optional[str] = Form(None),
    id_document: Optional[UploadFile] = File(None),
    license_document: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_guide),
    db: Session = Depends(get_db)
):
    """
    Update guide profile information and upload verification documents.
    This is part of the guide onboarding flow after initial signup.
    """
    # Ensure the user is a guide
    if current_user.role != RoleEnum.guide:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for guide accounts only",
        )

    # Get the guide profile
    guide_profile = db.query(GuideProfile).filter(GuideProfile.user_id == current_user.id).first()
    if not guide_profile:
        # This should not happen if the guide was created correctly, but just in case
        guide_profile = GuideProfile(user_id=current_user.id)
        db.add(guide_profile)

    # Update bio if provided
    if bio is not None:
        guide_profile.bio = bio

    # Handle ID document upload
    if id_document:
        # Read the file content
        id_content = await id_document.read()
        # Upload to storage
        id_path = await storage_service.upload_verification_document(
            file_content=id_content,
            filename=id_document.filename,
            user_id=current_user.id
        )
        guide_profile.id_document_url = id_path

    # Handle license document upload
    if license_document:
        # Read the file content
        license_content = await license_document.read()
        # Upload to storage
        license_path = await storage_service.upload_verification_document(
            file_content=license_content,
            filename=license_document.filename,
            user_id=current_user.id
        )
        guide_profile.license_document_url = license_path

    # Save changes
    db.commit()
    db.refresh(guide_profile)

    return {
        "message": "Guide profile updated successfully",
        "guide_profile": {
            "id": guide_profile.id,
            "user_id": guide_profile.user_id,
            "bio": guide_profile.bio,
            "verification_status": guide_profile.verification_status,
            "id_document_url": guide_profile.id_document_url,
            "license_document_url": guide_profile.license_document_url,
            "rating_avg": guide_profile.rating_avg,
        }
    }


@router.get("/me/verification-status", status_code=status.HTTP_200_OK)
def get_verification_status(
    current_user: User = Depends(get_current_guide),
    db: Session = Depends(get_db)
):
    """
    Get the guide's current verification status and latest rejection reason if applicable.
    Returns the verification status and the most recent audit log entry.
    """
    # Ensure the user is a guide
    if current_user.role != RoleEnum.guide:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for guide accounts only",
        )

    # Get the guide profile
    guide_profile = db.query(GuideProfile).filter(GuideProfile.user_id == current_user.id).first()
    if not guide_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide profile not found",
        )

    # Get the most recent verification audit log entry for this guide
    latest_audit = db.query(VerificationAuditLog).filter(
        VerificationAuditLog.guide_id == current_user.id
    ).order_by(VerificationAuditLog.created_at.desc()).first()

    result = {
        "verification_status": guide_profile.verification_status,
        "bio": guide_profile.bio,
        "id_document_url": guide_profile.id_document_url,
        "license_document_url": guide_profile.license_document_url,
        "rating_avg": guide_profile.rating_avg,
    }

    # Include audit log details if available
    if latest_audit:
        result["latest_action"] = {
            "action": latest_audit.action,
            "reason": latest_audit.reason,
            "created_at": latest_audit.created_at.isoformat() if latest_audit.created_at else None,
        }
    else:
        result["latest_action"] = None

    return result