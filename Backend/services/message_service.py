from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID
from ..models.message_usage import MessageUsage
from ..config import settings

def get_current_month_str():
    return datetime.utcnow().strftime("%Y-%m")

def get_month_usage(db: Session, user_id: UUID) -> MessageUsage:
    month_str = get_current_month_str()
    usage = db.query(MessageUsage).filter(
        MessageUsage.user_id == user_id,
        MessageUsage.month == month_str
    ).first()
    
    if not usage:
        usage = MessageUsage(user_id=user_id, month=month_str, message_count=0)
        db.add(usage)
        db.commit()
        db.refresh(usage)
        
    return usage

def check_message_limit(db: Session, user_id: UUID, subscription_tier: str) -> bool:
    if subscription_tier == 'premium':
        return True
    
    usage = get_month_usage(db, user_id)
    return usage.message_count < settings.FREE_TIER_MESSAGE_LIMIT

def increment_message_count(db: Session, user_id: UUID):
    usage = get_month_usage(db, user_id)
    usage.message_count += 1
    db.commit()
    return usage.message_count

def get_usage_stats(db: Session, user_id: UUID, subscription_tier: str):
    usage = get_month_usage(db, user_id)
    limit = settings.FREE_TIER_MESSAGE_LIMIT if subscription_tier == 'free' else -1
    
    return {
        "user_id": user_id,
        "month": usage.month,
        "message_count": usage.message_count,
        "limit": limit,
        "remaining": limit - usage.message_count if limit > -1 else -1
    }
