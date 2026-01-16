from sqlalchemy import Column, String, Boolean, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..database import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    # Storing hashed password just in case, though Supabase Auth handles it primarily.
    # For users who sign up via our API but we manually sync? 
    # Actually, if we use Supabase Auth, they handle password checking.
    # We'll keep this if we want hybrid or local-only fallback, but mostly redundant if fully relying on Supabase.
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints
    __table_args__ = (
        CheckConstraint(subscription_tier.in_(['free', 'premium']), name='check_subscription_tier'),
    )
