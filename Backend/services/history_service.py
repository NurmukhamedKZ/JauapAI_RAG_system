from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from uuid import UUID
from typing import Optional, List, Tuple
from ..models.conversation import Conversation
from ..models.message import Message

class HistoryService:
    """Service for managing chat history (conversations and messages)"""
    
    @staticmethod
    def create_conversation(
        db: Session, 
        user_id: UUID, 
        metadata_filter: dict = None,
        title: str = None
    ) -> Conversation:
        """Create a new conversation"""
        conv = Conversation(
            user_id=user_id, 
            metadata_filter=metadata_filter,
            title=title
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)
        return conv
    
    @staticmethod
    def get_conversation(
        db: Session, 
        conversation_id: UUID, 
        user_id: UUID
    ) -> Optional[Conversation]:
        """Get a conversation by ID (with user verification)"""
        return db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        ).first()
    
    @staticmethod
    def add_message(
        db: Session, 
        conversation_id: UUID, 
        role: str, 
        content: str,
        sources: list = None
    ) -> Message:
        """Add a message to a conversation"""
        msg = Message(
            conversation_id=conversation_id,
            role=role,
            content=content,
            sources=sources
        )
        db.add(msg)
        
        # Update conversation's updated_at timestamp
        db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).update({"updated_at": func.now()})
        
        db.commit()
        db.refresh(msg)
        return msg
    
    @staticmethod
    def get_conversation_messages(
        db: Session, 
        conversation_id: UUID
    ) -> List[Message]:
        """Get all messages for a conversation, ordered chronologically"""
        return db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at).all()
    
    @staticmethod
    def get_user_conversations(
        db: Session, 
        user_id: UUID,
        limit: int = 50
    ) -> List[Tuple[Conversation, int]]:
        """Get user's conversations with message count, ordered by most recent"""
        conversations = db.query(
            Conversation,
            func.count(Message.id).label('message_count')
        ).outerjoin(
            Message, Conversation.id == Message.conversation_id
        ).filter(
            Conversation.user_id == user_id
        ).group_by(
            Conversation.id
        ).order_by(
            desc(Conversation.updated_at)
        ).limit(limit).all()
        
        return conversations
    
    @staticmethod
    def delete_conversation(
        db: Session, 
        conversation_id: UUID, 
        user_id: UUID
    ) -> bool:
        """Delete a conversation (with user verification)"""
        conv = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        ).first()
        
        if conv:
            db.delete(conv)
            db.commit()
            return True
        return False
    
    @staticmethod
    def update_conversation_title(
        db: Session,
        conversation_id: UUID,
        title: str
    ) -> None:
        """Update conversation title"""
        db.query(Conversation).filter(
            Conversation.id == conversation_id
        ).update({"title": title})
        db.commit()
    
    @staticmethod
    def format_chat_history_for_llm(messages: List[Message]) -> List[dict]:
        """Format message history for LangChain/LLM consumption"""
        return [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]
