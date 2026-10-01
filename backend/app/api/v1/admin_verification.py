"""
Endpoints for admin verification queue management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User, RoleEnum
from app.models.guide_profile import GuideProfile
from app.models.verification_audit_log import VerificationAuditLog
from app.core.dependencies import get_current_admin
from app.schemas.user import UserBase

router = APIRouter()


@router.get("/verification/queue", response_model=List[dict])
def get_verification_queue(
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Get list of guides pending verification.
    Only accessible by admin users.
    """
    # Verify admin role (defense in depth)
    if current_admin.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for admin accounts only",
        )

    # Query for guides with pending verification status
    pending_guides = db.query(User, GuideProfile).join(
        GuideProfile, User.id == GuideProfile.user_id
    ).filter(
        GuideProfile.verification_status == "pending"
    ).offset(skip).limit(limit).all()

    # Format response
    result = []
    for user, guide_profile in pending_guides:
        result.append({
            "id": user.id,
            "email": user.email,
            "guide_profile_id": guide_profile.id,
            "bio": guide_profile.bio,
            "verification_status": guide_profile.verification_status,
            "id_document_url": guide_profile.id_document_url,
            "license_document_url": guide_profile.license_document_url,
            "created_at": guide_profile.created_at,
            "updated_at": guide_profile.updated_at,
        })

    return result


@router.put("/verification/{guide_id}/approve", response_model=dict)
def approve_guide(
    guide_id: int,
    reason: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Approve a guide's verification.
    Only accessible by admin users.
    """
    # Verify admin role
    if current_admin.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for admin accounts only",
        )

    # Get the guide's user and profile
    user = db.query(User).filter(User.id == guide_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Ensure the user is a guide
    if user.role != RoleEnum.guide:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a guide",
        )

    guide_profile = db.query(GuideProfile).filter(GuideProfile.user_id == guide_id).first()
    if not guide_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide profile not found",
        )

    # Update verification status
    guide_profile.verification_status = "approved"

    # Write to audit log
    audit_entry = VerificationAuditLog(
        guide_id=guide_id,
        admin_id=current_admin.id,
        action="approved",
        reason=reason
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(guide_profile)

    return {
        "message": "Guide verification approved successfully",
        "guide_profile": {
            "id": guide_profile.id,
            "user_id": guide_profile.user_id,
            "verification_status": guide_profile.verification_status,
            "bio": guide_profile.bio,
            "id_document_url": guide_profile.id_document_url,
            "license_document_url": guide_profile.license_document_url,
        },
        "approved_by": current_admin.id,
        "reason": reason
    }


@router.put("/verification/{guide_id}/reject", response_model=dict)
def reject_guide(
    guide_id: int,
    reason: str,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Reject a guide's verification.
    Only accessible by admin users.
    Reason is required for rejection.
    """
    # Verify admin role
    if current_admin.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is for admin accounts only",
        )

    # Require reason for rejection
    if not reason or reason.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reason is required for rejection",
        )

    # Get the guide's user and profile
    user = db.query(User).filter(User.id == guide_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Ensure the user is a guide
    if user.role != RoleEnum.guide:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not a guide",
        )

    guide_profile = db.query(GuideProfile).filter(GuideProfile.user_id == guide_id).first()
    if not guide_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guide profile not found",
        )

    # Update verification status
    guide_profile.verification_status = "rejected"

    # Write to audit log (reason is required for rejection)
    audit_entry = VerificationAuditLog(
        guide_id=guide_id,
        admin_id=current_admin.id,
        action="rejected",
        reason=reason
    )
    db.add(audit_entry)

    db.commit()
    db.refresh(guide_profile)

    return {
        "message": "Guide verification rejected",
        "guide_profile": {
            "id": guide_profile.id,
            "user_id": guide_profile.user_id,
            "verification_status": guide_profile.verification_status,
            "bio": guide_profile.bio,
            "id_document_url": guide_profile.id_document_url,
            "license_document_url": guide_profile.license_document_url,
        },
        "rejected_by": current_admin.id,
        "reason": reason
    }