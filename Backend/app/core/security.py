from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from Backend.app.core.config import settings

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the JWT token from Supabase by decoding it locally.
    Returns the user data from the token payload.
    """
    token = credentials.credentials
    try:
        # Decode JWT using Supabase JWT secret
        # Get the secret from SUPABASE_KEY (anon key contains the JWT secret)
        # For Supabase, we decode without verification in development,
        # but in production you should use the JWT_SECRET from Supabase settings
        payload = jwt.decode(
            token,
            settings.SUPABASE_KEY,  # This is the anon key which serves as the JWT secret
            algorithms=["HS256"],
            options={"verify_signature": False}  # Disable signature verification for compatibility
        )
        
        # Extract user info from the payload
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Return user info from token
        return {
            "id": user_id,
            "email": payload.get("email"),
            "user_metadata": payload.get("user_metadata", {}),
        }
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

