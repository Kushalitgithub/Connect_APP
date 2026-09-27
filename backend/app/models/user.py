"""
User model.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base import Base


class RoleEnum(str, enum.Enum):
    tourist = "tourist"
    guide = "guide"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    guide_profile = relationship("GuideProfile", back_populates="user", uselist=False)
    tourist_bookings = relationship("Booking", foreign_keys="Booking.tourist_id", back_populates="tourist")
    guide_bookings = relationship("Booking", foreign_keys="Booking.guide_id", back_populates="guide")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    reviews = relationship("Review", foreign_keys="Review.tourist_id", back_populates="tourist")
    reports = relationship("Report", foreign_keys="Report.reporter_id", back_populates="reporter")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")