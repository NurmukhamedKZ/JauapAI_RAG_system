"""
Subject Vote model for tracking user preferences on future subjects.
"""
from sqlalchemy import Column, String, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid

from Backend.app.db.database import Base


class SubjectVote(Base):
    """Track user votes for subjects they want to see added."""
    
    __tablename__ = "subject_votes"
    
    __table_args__ = (
        Index('ix_subject_votes_subject', 'subject'),
        Index('ix_subject_votes_user_id', 'user_id'),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)  # e.g., 'География', 'Математика', 'Физика'
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User")
