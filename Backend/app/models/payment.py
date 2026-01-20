"""
Payment model for tracking Telegram Stars transactions.
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from Backend.app.db.database import Base


class Payment(Base):
    """Payment record for Telegram Stars transactions."""
    
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Telegram payment identifiers
    telegram_payment_charge_id = Column(String, unique=True, nullable=True)  # For refunds
    provider_payment_charge_id = Column(String, nullable=True)
    
    # Payment details
    amount_stars = Column(Integer, nullable=False)  # Amount in Telegram Stars
    payload = Column(String, nullable=False)  # Our internal reference (e.g., "pro_subscription_{user_id}")
    
    # Status tracking
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", backref="payments")
