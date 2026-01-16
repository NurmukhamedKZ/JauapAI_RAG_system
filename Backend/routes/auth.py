from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.schemas import UserCreate, UserLogin, UserResponse
from ..auth.security import get_current_user, supabase
from ..models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Sign up with Supabase
    try:
        res = supabase.auth.sign_up({
            "email": user_in.email, 
            "password": user_in.password,
            "options": {
                "data": {
                    "full_name": user_in.full_name
                }
            }
        })
        
        if not res.user:
             raise HTTPException(status_code=400, detail="Registration failed")
             
        # 2. Create local user record
        # Note: Supabase might have auto-confirmed or not. 
        # We create the record here to ensure we have it.
        new_user = User(
            id=res.user.id,
            email=user_in.email,
            full_name=user_in.full_name,
            is_active=True,
            subscription_tier='free'
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
        
    except Exception as e:
        # Check if user already exists
        if "User already registered" in str(e):
             raise HTTPException(status_code=400, detail="Email already registered")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(user_in: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user_in.email,
            "password": user_in.password
        })
        return res.session
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid credentials")

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
