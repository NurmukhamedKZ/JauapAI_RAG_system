"""
Payment endpoints for Telegram Stars payment integration.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from Backend.app.db.database import get_db
from Backend.app.models.user import User
from Backend.app.models.payment import Payment
from Backend.app.core.security import get_current_user
from Backend.app.core.config import settings
from Backend.app.services.telegram_bot import telegram_bot_service, get_payment_link

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentLinkResponse(BaseModel):
    """Response schema for payment link."""
    telegram_link: str
    bot_username: str
    price_stars: int


class PaymentStatusResponse(BaseModel):
    """Response schema for payment status."""
    has_pending_payment: bool
    last_payment_status: Optional[str] = None
    last_payment_date: Optional[datetime] = None


class WebhookResponse(BaseModel):
    """Response for webhook processing."""
    ok: bool


@router.get("/link", response_model=PaymentLinkResponse)
def get_payment_link_endpoint(
    current_user: User = Depends(get_current_user)
):
    """
    Get Telegram payment link for the current user.
    
    Returns a deep link to the Telegram payment bot with the user's ID
    encoded in the start parameter.
    """
    if not settings.TELEGRAM_BOT_USERNAME:
        raise HTTPException(
            status_code=503,
            detail="Payment system is not configured. Please contact support."
        )
    
    # Check if user already has pro subscription
    if current_user.subscription_tier == "pro":
        raise HTTPException(
            status_code=400,
            detail="You already have a Pro subscription."
        )
    
    try:
        link = get_payment_link(str(current_user.id))
        return PaymentLinkResponse(
            telegram_link=link,
            bot_username=settings.TELEGRAM_BOT_USERNAME,
            price_stars=settings.PRO_PLAN_PRICE_STARS
        )
    except ValueError as e:
        logger.error(f"Failed to generate payment link: {e}")
        raise HTTPException(
            status_code=503,
            detail="Payment system is not available. Please try again later."
        )


@router.get("/status", response_model=PaymentStatusResponse)
def get_payment_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get payment status for the current user.
    
    Returns information about pending and completed payments.
    """
    # Get latest payment for the user
    latest_payment = (
        db.query(Payment)
        .filter(Payment.user_id == current_user.id)
        .order_by(Payment.created_at.desc())
        .first()
    )
    
    has_pending = (
        db.query(Payment)
        .filter(
            Payment.user_id == current_user.id,
            Payment.status == "pending"
        )
        .first() is not None
    )
    
    return PaymentStatusResponse(
        has_pending_payment=has_pending,
        last_payment_status=latest_payment.status if latest_payment else None,
        last_payment_date=latest_payment.created_at if latest_payment else None
    )



@router.post("/webhook", response_model=WebhookResponse)
async def telegram_webhook(request: Request):
    """
    Receive webhook updates from Telegram.
    
    This endpoint processes updates from Telegram including
    payment confirmations, pre-checkout queries, and commands.
    """
    try:
        update_data = await request.json()
        logger.info(f"Received Telegram update: {update_data.get('update_id')}")
        
        # Process the update
        await telegram_bot_service.process_update(update_data)
        
        return WebhookResponse(ok=True)
        
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        # Always return 200 to Telegram to prevent retries
        return WebhookResponse(ok=True)
