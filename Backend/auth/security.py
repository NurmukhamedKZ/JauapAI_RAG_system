from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from supabase import create_client, Client
from sqlalchemy.orm import Session
from ..database import get_db
from ..config import settings
from ..models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Initialize Supabase Client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Verifies the JWT token with Supabase and retrieves the local user.
    If the user exists in Supabase but not locally, creates the local user record.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify token with Supabase
        user_data = supabase.auth.get_user(token)
        if not user_data or not user_data.user:
            raise credentials_exception
            
        supabase_user_id = user_data.user.id
        email = user_data.user.email
        
        # Check if user exists in our local DB
        # Note: We cast UUID to str for query if needed, or SQLAlchemy handles UUID comparison
        user = db.query(User).filter(User.id == supabase_user_id).first()
        
        if not user:
            # Sync user from Supabase to local DB
            user = User(
                id=supabase_user_id,
                email=email,
                full_name=user_data.user.user_metadata.get('full_name'),
                is_active=True,
                subscription_tier='free'
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        return user
        
    except Exception as e:
        print(f"Auth Error: {str(e)}")
        raise credentials_exception
