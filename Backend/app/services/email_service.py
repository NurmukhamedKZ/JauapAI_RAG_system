"""
Email service for sending verification and notification emails using Resend.
"""
import logging
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import resend

from Backend.app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via Resend."""
    
    def __init__(self):
        self.api_key = settings.RESEND_API_KEY
        self.from_email = settings.RESEND_FROM_EMAIL
        self.frontend_url = settings.FRONTEND_URL
        
        if self.api_key:
            resend.api_key = self.api_key
    
    def is_configured(self) -> bool:
        """Check if email service is properly configured."""
        return bool(self.api_key and self.from_email)
    
    @staticmethod
    def generate_verification_token() -> str:
        """Generate a secure random verification token."""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def get_token_expiry() -> datetime:
        """Get expiration datetime for verification token."""
        return datetime.now(timezone.utc) + timedelta(
            hours=settings.EMAIL_VERIFICATION_EXPIRE_HOURS
        )
    
    def send_verification_email(
        self,
        to_email: str,
        token: str,
        user_name: Optional[str] = None
    ) -> bool:
        """
        Send email verification link to user.
        
        Args:
            to_email: Recipient email address
            token: Verification token
            user_name: Optional user name for personalization
            
        Returns:
            True if email sent successfully, False otherwise
        """
        if not self.is_configured():
            logger.warning("Email service not configured, skipping verification email")
            return False
        
        verification_url = f"{self.frontend_url}/verify-email?token={token}"
        greeting = f"Привет, {user_name}!" if user_name else "Привет!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #f8fafc; font-size: 28px; margin: 0;">
                        Jauap<span style="color: #10b981;">AI</span>
                    </h1>
                </div>
                
                <h2 style="color: #f8fafc; font-size: 22px; margin: 0 0 16px 0; text-align: center;">
                    Подтвердите ваш email
                </h2>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    {greeting}
                </p>
                
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                    Спасибо за регистрацию в JauapAI! Нажмите кнопку ниже, чтобы подтвердить ваш email адрес.
                </p>
                
                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="{verification_url}" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #0f172a; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
                        ✓ Подтвердить Email
                    </a>
                </div>
                
                <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                    Если кнопка не работает, скопируйте эту ссылку в браузер:
                </p>
                <p style="color: #10b981; font-size: 12px; word-break: break-all; margin: 0 0 32px 0;">
                    {verification_url}
                </p>
                
                <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 32px 0;">
                
                <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
                    Ссылка действительна {settings.EMAIL_VERIFICATION_EXPIRE_HOURS} часов.<br>
                    Если вы не регистрировались в JauapAI, проигнорируйте это письмо.
                </p>
            </div>
        </body>
        </html>
        """
        
        try:
            params = {
                "from": f"JauapAI <{self.from_email}>",
                "to": [to_email],
                "subject": "Подтвердите ваш email - JauapAI",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Verification email sent to {to_email}, id: {response.get('id')}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send verification email to {to_email}: {e}")
            return False


# Global email service instance
email_service = EmailService()
