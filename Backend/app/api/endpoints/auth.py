"""
Authentication endpoints for user registration and login.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from Backend.app.db.database import get_db
from Backend.app.models.user import User
from Backend.app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse, GoogleAuthRequest
from Backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from Backend.app.core.config import settings
from Backend.app.services.user_service import get_user_message_limit

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user.
    
    Creates a new user account and returns an access token.
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=request.email,
        password_hash=hash_password(request.password),
        full_name=request.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Login with email and password.
    
    Validates credentials and returns an access token.
    """
    # Find user
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user.
    
    Returns user profile information including subscription status.
    """
    limit = get_user_message_limit(current_user)
    
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        subscription_tier=current_user.subscription_tier,
        message_count=current_user.message_count,
        message_limit=limit,
        created_at=current_user.created_at,
    )


@router.post("/google", response_model=TokenResponse)
def google_auth(request: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Authenticate with Google OAuth.
    
    Accepts Google access token, fetches user info, creates user if not exists, and returns JWT.
    """
    import httpx
    
    try:
        # Verify access token by calling Google's userinfo endpoint
        with httpx.Client() as client:
            response = client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {request.credential}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid Google token"
                )
            
            userinfo = response.json()
        
        # Get user info from response
        google_id = userinfo.get("sub")
        email = userinfo.get("email")
        full_name = userinfo.get("name")
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google"
            )
        
        # Find existing user by google_id or email
        user = db.query(User).filter(
            (User.google_id == google_id) | (User.email == email)
        ).first()
        
        if user:
            # Update google_id if user exists but logged in with email before
            if not user.google_id:
                user.google_id = google_id
                db.commit()
        else:
            # Create new user
            user = User(
                email=email,
                google_id=google_id,
                full_name=full_name,
                password_hash=None,  # No password for OAuth users
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Failed to verify Google token: {str(e)}"
        )


