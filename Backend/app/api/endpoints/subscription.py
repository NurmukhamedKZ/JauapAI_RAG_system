"""
Subscription endpoints for managing user plans and message limits.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from dateutil.relativedelta import relativedelta
from pydantic import BaseModel

from Backend.app.db.database import get_db
from Backend.app.models.user import User
from Backend.app.core.security import get_current_user
from Backend.app.core.config import settings
from Backend.app.services.user_service import (
    check_and_reset_message_count,
    get_user_message_limit,
)

router = APIRouter(prefix="/subscription", tags=["Subscription"])


class SubscriptionStatus(BaseModel):
    """Response schema for subscription status."""
    plan: str
    message_count: int
    message_limit: int
    messages_remaining: int
    reset_date: datetime

    class Config:
        from_attributes = True


class ToggleResponse(BaseModel):
    """Response schema for plan toggle."""
    new_plan: str
    message: str


@router.get("/status", response_model=SubscriptionStatus)
def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current subscription status including message usage."""
    user = check_and_reset_message_count(current_user, db)
    limit = get_user_message_limit(user)
    
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
    """
    Toggle between free and pro plans.
    
    Note: This is for testing purposes only. In production, this would be
    handled by a payment processor integration.
    """
    if current_user.subscription_tier == "free":
        current_user.subscription_tier = "pro"
        new_limit = settings.plan_limits["pro"]
        message = f"Upgraded to Pro plan! You now have {new_limit} messages/month."
    else:
        current_user.subscription_tier = "free"
        new_limit = settings.plan_limits["free"]
        message = f"Switched to Free plan. You have {new_limit} messages/month."
    
    db.commit()
    db.refresh(current_user)
    
    return ToggleResponse(
        new_plan=current_user.subscription_tier,
        message=message
    )
