"""
VerificationAuditLog model for tracking admin verification actions.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class VerificationAuditLog(Base):
    __tablename__ = "verification_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    action = Column(String(20), nullable=False)  # approved, rejected
    reason = Column(Text, nullable=True)  # required for rejections, optional for approvals
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    guide = relationship("User", foreign_keys=[guide_id], backref="verification_audit_logs_as_guide")
    admin = relationship("User", foreign_keys=[admin_id], backref="verification_audit_logs_as_admin")
