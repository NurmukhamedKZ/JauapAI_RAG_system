"""
User service module for user-related business logic.
Centralizes user operations to avoid code duplication across endpoints.
"""
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session

from Backend.app.models.user import User
from Backend.app.core.config import settings


def check_and_reset_message_count(user: User, db: Session) -> User:
    """
    Reset message count if a month has passed since last reset.
    
    Args:
        user: User model instance
        db: Database session
        
    Returns:
        Updated User instance with potentially reset message count
    """
    now = datetime.now(timezone.utc)
    reset_threshold = now - relativedelta(months=1)
    
    last_reset = user.message_count_reset_at
    # Ensure last_reset is timezone-aware if it exists
    if last_reset and last_reset.tzinfo is None:
        last_reset = last_reset.replace(tzinfo=timezone.utc)
    
    if last_reset is None or last_reset < reset_threshold:
        user.message_count = 0
        user.message_count_reset_at = now
        db.commit()
        db.refresh(user)
    
    return user


def get_user_message_limit(user: User) -> int:
    """
    Get the message limit for a user based on their subscription tier.
    
    Args:
        user: User model instance
        
    Returns:
        Message limit for the user's plan
    """
    return settings.plan_limits.get(user.subscription_tier, settings.FREE_TIER_MESSAGE_LIMIT)


def check_message_limit(user: User) -> tuple[bool, str]:
    """
    Check if user has reached their message limit.
    
    Args:
        user: User model instance
        
    Returns:
        Tuple of (is_within_limit, error_message)
    """
    limit = get_user_message_limit(user)
    if user.message_count >= limit:
        return False, f"Message limit reached. You have used {user.message_count}/{limit} messages this month. Upgrade to Pro for more messages."
    return True, ""


def increment_message_count(user: User, db: Session) -> User:
    """
    Increment the message count for a user.
    
    Args:
        user: User model instance
        db: Database session
        
    Returns:
        Updated User instance
    """
    user.message_count += 1
    db.commit()
    db.refresh(user)
    return user


def decrement_message_count(user: User, db: Session) -> User:
    """
    Decrement the message count for a user (used for rollback on error).
    
    Args:
        user: User model instance
        db: Database session
        
    Returns:
        Updated User instance
    """
    if user.message_count > 0:
        user.message_count -= 1
        db.commit()
        db.refresh(user)
    return user
