from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from dateutil.relativedelta import relativedelta

from Backend.app.db.database import get_db
from Backend.app.models.user import User
from Backend.app.core.security import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/subscription", tags=["Subscription"])

# Plan limits
PLAN_LIMITS = {
    "free": 5,
    "pro": 200,
}

class SubscriptionStatus(BaseModel):
    plan: str
    message_count: int
    message_limit: int
    messages_remaining: int
    reset_date: datetime

    class Config:
        from_attributes = True

class ToggleResponse(BaseModel):
    new_plan: str
    message: str


def check_and_reset_message_count(user: User, db: Session) -> User:
    """Reset message count if a month has passed since last reset."""
    now = datetime.utcnow()
    if user.message_count_reset_at is None or user.message_count_reset_at < now - relativedelta(months=1):
        user.message_count = 0
        user.message_count_reset_at = now
        db.commit()
        db.refresh(user)
    return user


@router.get("/status", response_model=SubscriptionStatus)
def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current subscription status including message usage."""
    user = check_and_reset_message_count(current_user, db)
    limit = PLAN_LIMITS.get(user.subscription_tier, 5)
    
    return SubscriptionStatus(
        plan=user.subscription_tier,
        message_count=user.message_count,
        message_limit=limit,
        messages_remaining=max(0, limit - user.message_count),
        reset_date=user.message_count_reset_at + relativedelta(months=1)
    )


@router.post("/toggle", response_model=ToggleResponse)
def toggle_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Toggle between free and pro plans (for testing purposes only)."""
    if current_user.subscription_tier == "free":
        current_user.subscription_tier = "pro"
        message = "Upgraded to Pro plan! You now have 200 messages/month."
    else:
        current_user.subscription_tier = "free"
        message = "Switched to Free plan. You have 5 messages/month."
    
    db.commit()
    db.refresh(current_user)
    
    return ToggleResponse(
        new_plan=current_user.subscription_tier,
        message=message
    )
