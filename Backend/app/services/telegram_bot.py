"""
Telegram Bot Service for handling Telegram Stars payments.

This module implements the payment flow:
1. User starts bot with deep link (purchase_{user_id})
2. Bot sends invoice for Pro subscription
3. User pays with Telegram Stars
4. Bot confirms payment and updates user subscription
"""
import logging
from datetime import datetime, timezone
from typing import Optional

from telegram import Update, LabeledPrice
from telegram.ext import (
    Application,
    CommandHandler,
    PreCheckoutQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

from Backend.app.core.config import settings
from Backend.app.db.database import SessionLocal
# Import all models to ensure SQLAlchemy relationships are properly resolved
# The order matters: base models first, then models with relationships
from Backend.app.models.chat import Conversation, Message  # noqa: F401
from Backend.app.models.user import User
from Backend.app.models.payment import Payment

logger = logging.getLogger(__name__)


class TelegramBotService:
    """Service for handling Telegram Stars payments."""
    
    def __init__(self):
        self.token = settings.TELEGRAM_BOT_TOKEN
        self.bot_username = settings.TELEGRAM_BOT_USERNAME
        self.price_stars = settings.PRO_PLAN_PRICE_STARS
        self.application: Optional[Application] = None
    
    def _get_db(self):
        """Get database session."""
        return SessionLocal()
    
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Handle /start command with optional deep link for payment.
        
        Deep link format: /start purchase_{user_id}
        """
        user = update.effective_user
        chat_id = update.effective_chat.id
        
        if not context.args:
            # Regular start without payment intent
            await update.message.reply_text(
                f"👋 Привет, {user.first_name}!\n\n"
                "Я бот для оплаты подписки JauapAI.\n\n"
                "Чтобы оформить Pro подписку, перейдите на наш сайт и нажмите кнопку 'Подписаться'."
            )
            return
        
        # Parse deep link parameter
        payload = context.args[0]
        
        if not payload.startswith("purchase_"):
            await update.message.reply_text(
                "❌ Неверная ссылка для оплаты. Пожалуйста, используйте ссылку с сайта."
            )
            return
        
        # Extract user_id from payload
        try:
            backend_user_id = payload.replace("purchase_", "")
        except (IndexError, ValueError):
            await update.message.reply_text(
                "❌ Неверный формат ссылки. Пожалуйста, попробуйте снова."
            )
            return
        
        # Create pending payment record
        db = self._get_db()
        try:
            # Verify user exists
            db_user = db.query(User).filter(User.id == backend_user_id).first()
            if not db_user:
                await update.message.reply_text(
                    "❌ Пользователь не найден. Пожалуйста, войдите в систему на сайте."
                )
                return
            
            # Check if user already has pro subscription
            if db_user.subscription_tier == "pro":
                await update.message.reply_text(
                    "✅ У вас уже есть Pro подписка! Спасибо за поддержку."
                )
                return
            
            # Create pending payment
            payment = Payment(
                user_id=backend_user_id,
                amount_stars=self.price_stars,
                payload=f"pro_subscription_{backend_user_id}",
                status="pending"
            )
            db.add(payment)
            db.commit()
            db.refresh(payment)
            payment_id = str(payment.id)
        finally:
            db.close()
        
        # Send invoice
        title = "JauapAI Pro Подписка"
        description = (
            "🚀 Pro подписка на 1 месяц\n\n"
            "✅ 200 сообщений в месяц\n"
            "✅ Приоритетная поддержка\n"
            "✅ Доступ ко всем функциям"
        )
        
        # Create price (amount in Telegram Stars)
        prices = [LabeledPrice("Pro подписка", self.price_stars)]
        
        await context.bot.send_invoice(
            chat_id=chat_id,
            title=title,
            description=description,
            payload=f"{payment_id}_{backend_user_id}",  # Include payment ID and user ID
            provider_token="",  # Empty for digital goods with Stars
            currency="XTR",  # Telegram Stars currency code
            prices=prices,
        )
    
    async def pre_checkout_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Handle pre-checkout query - validate payment before processing.
        
        This is called when user clicks 'Pay' button but before payment is processed.
        You have 10 seconds to respond.
        """
        query = update.pre_checkout_query
        
        try:
            # Parse payload
            payload_parts = query.invoice_payload.split("_")
            payment_id = payload_parts[0]
            
            # Verify payment exists and is pending
            db = self._get_db()
            try:
                payment = db.query(Payment).filter(Payment.id == payment_id).first()
                
                if not payment:
                    await query.answer(ok=False, error_message="Платёж не найден. Попробуйте снова.")
                    return
                
                if payment.status != "pending":
                    await query.answer(ok=False, error_message="Этот платёж уже обработан.")
                    return
                
                # Payment is valid, approve checkout
                await query.answer(ok=True)
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Pre-checkout error: {e}")
            await query.answer(ok=False, error_message="Произошла ошибка. Попробуйте позже.")
    
    async def successful_payment_callback(self, update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
        """
        Handle successful payment - update user subscription.
        
        This is called after payment is successfully processed.
        """
        payment_info = update.message.successful_payment
        
        try:
            # Parse payload to get payment ID and user ID
            payload_parts = payment_info.invoice_payload.split("_")
            payment_id = payload_parts[0]
            user_id = "_".join(payload_parts[1:])  # Handle UUIDs with underscores
            
            db = self._get_db()
            try:
                # Update payment record
                payment = db.query(Payment).filter(Payment.id == payment_id).first()
                if payment:
                    payment.status = "completed"
                    payment.completed_at = datetime.now(timezone.utc)
                    payment.telegram_payment_charge_id = payment_info.telegram_payment_charge_id
                    payment.provider_payment_charge_id = payment_info.provider_payment_charge_id
                
                # Upgrade user to Pro
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    user.subscription_tier = "pro"
                    user.message_count = 0  # Reset message count
                    user.message_count_reset_at = datetime.now(timezone.utc)
                    logger.info(f"User {user_id} upgraded to Pro via Telegram Stars")
                
                db.commit()
                
            finally:
                db.close()
            
            # Send confirmation message
            await update.message.reply_text(
                "🎉 Оплата успешна!\n\n"
                "✅ Ваша Pro подписка активирована!\n\n"
                "Теперь у вас есть доступ к:\n"
                "• 200 сообщений в месяц\n"
                "• Приоритетная поддержка\n"
                "• Все функции JauapAI\n\n"
                "Спасибо за подписку! 💙"
            )
            
        except Exception as e:
            logger.error(f"Successful payment handling error: {e}")
            await update.message.reply_text(
                "⚠️ Платёж получен, но произошла ошибка активации.\n"
                "Пожалуйста, обратитесь в поддержку с этим сообщением."
            )
    
    def create_application(self) -> Application:
        """Create and configure the Telegram bot application."""
        if not self.token:
            raise ValueError("TELEGRAM_BOT_TOKEN is not set")
        
        application = Application.builder().token(self.token).build()
        
        # Add handlers
        application.add_handler(CommandHandler("start", self.start_command))
        application.add_handler(PreCheckoutQueryHandler(self.pre_checkout_callback))
        application.add_handler(
            MessageHandler(filters.SUCCESSFUL_PAYMENT, self.successful_payment_callback)
        )
        
        self.application = application
        return application
    
    async def process_update(self, update_data: dict) -> None:
        """Process a webhook update from Telegram."""
        if not self.application:
            self.create_application()
        
        update = Update.de_json(update_data, self.application.bot)
        await self.application.process_update(update)


# Global bot service instance
telegram_bot_service = TelegramBotService()


def get_payment_link(user_id: str) -> str:
    """Generate a Telegram deep link for payment."""
    bot_username = settings.TELEGRAM_BOT_USERNAME
    if not bot_username:
        raise ValueError("TELEGRAM_BOT_USERNAME is not set")
    
    return f"https://t.me/{bot_username}?start=purchase_{user_id}"


# For running the bot in polling mode (development)
if __name__ == "__main__":
    import asyncio
    
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    
    service = TelegramBotService()
    app = service.create_application()
    
    print("Starting Telegram bot in polling mode...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)
