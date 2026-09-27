"""
GuideProfile model.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.user import User


class GuideProfile(Base):
    __tablename__ = "guide_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text)
    verification_status = Column(String(20), default="pending")  # pending, approved, rejected
    rating_avg = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="guide_profile")
    tour_listings = relationship("TourListing", back_populates="guide")
    # Note: We don't set up reverse for bookings here because Booking has foreign keys to User (tourist and guide) and we already have those in User.