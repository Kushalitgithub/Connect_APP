"""
Availability model.
"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Integer as SqlInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.user import User


class Availability(Base):
    __tablename__ = "availabilities"

    id = Column(Integer, primary_key=True, index=True)
    tour_listing_id = Column(Integer, ForeignKey("tour_listings.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)  # We'll store the date (and time if needed) for the slot.
    slots_remaining = Column(SqlInteger, nullable=False)  # How many slots are left for this date.

    # Relationships
    tour_listing = relationship("TourListing", back_populates="availabilities")
    # Note: We don't set up reverse for bookings here because Booking has foreign key to Availability? Actually, in the TAD, Booking has a date and tour_listing_id, but we are going to link Booking to Availability for the slot.
    # However, to prevent race conditions, we lock the availability slot. We'll add a relationship from Booking to Availability later.