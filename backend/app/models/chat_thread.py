"""
ChatThread model.
"""
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base
from app.models.user import User


class ChatThread(Base):
    __tablename__ = "chat_threads"

    id = Column(Integer, primary_key=True, index=True)
    tourist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    guide_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)  # Nullable for pre-booking inquiries
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tourist = relationship("User", foreign_keys=[tourist_id])
    guide = relationship("User", foreign_keys=[guide_id])
    booking = relationship("Booking", foreign_keys=[booking_id])
    messages = relationship("Message", back_populates="thread", cascade="all, delete-orphan")