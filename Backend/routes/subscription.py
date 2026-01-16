from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.security import get_current_user
from ..models.user import User
from ..services.message_service import get_usage_stats
from ..auth.schemas import MessageUsageResponse

router = APIRouter(prefix="/subscription", tags=["Subscription"])

@router.get("/usage", response_model=MessageUsageResponse)
def get_usage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current message usage statistics for the user.
    """
    stats = get_usage_stats(db, current_user.id, current_user.subscription_tier)
    return stats

@router.post("/upgrade")
def upgrade_to_premium(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Placeholder for upgrading to premium. 
    In real app, this would initiate Stripe checkout.
    """
    current_user.subscription_tier = 'premium'
    db.commit()
    return {"status": "success", "message": "Upgraded to Premium (Mock)"}
