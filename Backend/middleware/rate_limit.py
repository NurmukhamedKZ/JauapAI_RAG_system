from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from ..database import SessionLocal
from ..auth.security import get_current_user, oauth2_scheme
from ..services.message_service import check_message_limit
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from jwt import decode, InvalidTokenError
from ..config import settings

# NOTE: Middleware runs before dependency injection, so we have to manually 
# Check auth token if we want to enforce limits globally at middleware level.
# Alternatively, we can use a dependency in the specific routes (cleaner for FastAPI).
# Given we are monolithic, using a dependency 'check_limit' is often better than raw middleware 
# which might run on static files or unchecked routes.

# Let's create a dependency instead of middleware class for better integration with FastAPI docs/auth.

from fastapi import Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User

def check_chat_rate_limit(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Dependency to check if user has reached their message limit.
    Use this in Chat endpoints.
    """
    allowed = check_message_limit(db, user.id, user.subscription_tier)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Free tier limit of {settings.FREE_TIER_MESSAGE_LIMIT} messages reached. Please upgrade to Premium."
        )
    return True
