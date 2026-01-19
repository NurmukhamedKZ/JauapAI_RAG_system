"""
API v1 router.
Aggregates all v1 endpoint routers.
"""
from fastapi import APIRouter
from Backend.app.api.endpoints import auth, chat, conversations, subscription

router = APIRouter()

# Include all endpoint routers
router.include_router(auth.router)
router.include_router(chat.router)
router.include_router(conversations.router)
router.include_router(subscription.router)
