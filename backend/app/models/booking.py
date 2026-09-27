"""
Booking model.
"""
from sqlalchemy import Column, Integer, DateTime, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base import Base
from app.models.user import User


class BookingStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    completed = "completed"
    cancelled = "cancelled"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tour_listing_id = Column(Integer, ForeignKey("tour_listings.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)  # The date of the tour.
    status = Column(Enum(BookingStatusEnum), default=BookingStatusEnum.pending)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tourist = relationship("User", foreign_keys=[tourist_id])
    tour_listing = relationship("TourListing", foreign_keys=[tour_listing_id])
    # Note: We don't set up reverse for messages here because Message has a thread_id and we will set up ChatThread and Message models.