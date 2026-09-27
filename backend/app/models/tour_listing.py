"""
TourListing model.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.user import User


class TourListing(Base):
    __tablename__ = "tour_listings"

    id = Column(Integer, primary_key=True, index=True)
    guide_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    itinerary = Column(Text)
    price = Column(Float, nullable=False)  # price per person or per group? We'll assume per person for simplicity.
    capacity = Column(Integer, nullable=False)  # maximum number of tourists
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    guide = relationship("User", foreign_keys=[guide_id])
    availabilities = relationship("Availability", back_populates="tour_listing", cascade="all, delete-orphan")
    # Note: We don't set up reverse for bookings here because Booking has foreign key to TourListing and we can access from Booking.