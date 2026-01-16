from supabase import create_client, Client
from Backend.app.core.config import settings

def get_supabase() -> Client:
    url: str = settings.SUPABASE_URL
    key: str = settings.SUPABASE_KEY
    supabase: Client = create_client(url, key)
    return supabase

# Global instance for ease of use (optional, but convenient)
supabase_client = get_supabase()
