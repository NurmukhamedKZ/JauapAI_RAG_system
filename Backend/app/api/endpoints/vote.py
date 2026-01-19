"""
Vote endpoint for tracking user preferences on future subjects.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from Backend.app.core.security import get_current_user
from Backend.app.models.user import User
from Backend.app.models.vote import SubjectVote
from Backend.app.db.database import get_db

logger = logging.getLogger(__name__)

router = APIRouter()


class VoteRequest(BaseModel):
    """Request schema for voting endpoint."""
    subject: str


class VoteResponse(BaseModel):
    """Response schema for voting endpoint."""
    success: bool
    message: str


class VoteStats(BaseModel):
    """Response schema for vote statistics."""
    subject: str
    count: int


@router.post("/vote", response_model=VoteResponse)
async def submit_vote(
    vote_request: VoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a vote for a subject to be added next.
    Users can only vote once per subject.
    """
    allowed_subjects = ['География', 'Математика', 'Физика']
    
    if vote_request.subject not in allowed_subjects:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid subject. Allowed: {', '.join(allowed_subjects)}"
        )
    
    # Check if user already voted for this subject
    existing_vote = db.query(SubjectVote).filter(
        SubjectVote.user_id == current_user.id,
        SubjectVote.subject == vote_request.subject
    ).first()
    
    if existing_vote:
        return VoteResponse(
            success=False,
            message="Сіз бұл пәнге дауыс бердіңіз"
        )
    
    # Create new vote
    new_vote = SubjectVote(
        user_id=current_user.id,
        subject=vote_request.subject
    )
    db.add(new_vote)
    db.commit()
    
    logger.info(f"User {current_user.id} voted for subject: {vote_request.subject}")
    
    return VoteResponse(
        success=True,
        message="Дауысыңыз қабылданды! Рахмет!"
    )


@router.get("/votes/stats", response_model=list[VoteStats])
async def get_vote_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get vote statistics for all subjects.
    Only shows results to admin users (you can add admin check here).
    """
    stats = db.query(
        SubjectVote.subject,
        func.count(SubjectVote.id).label('count')
    ).group_by(SubjectVote.subject).all()
    
    return [VoteStats(subject=s.subject, count=s.count) for s in stats]
