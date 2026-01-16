from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

from Backend.app.core.security import get_current_user

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    filters: Optional[Dict[str, Any]] = None

@router.post("/chat")
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat endpoint protected by Supabase Auth.
    Streams the response from Gemini.
    """
    rag_service = getattr(request.app.state, "rag_service", None)
    if not rag_service:
        raise HTTPException(status_code=500, detail="RAG Service not initialized")

    try:
        # Use the stream_chat method from RAGService
        # The chain.stream returns an iterator of chunks.
        # We need to yield bytes or string.
        
        async def generate():
            # Note: chain.stream is synchronous generator usually unless using astream
            # If RAGService uses synchronous chain.stream:
            for chunk in rag_service.stream_chat(chat_request.message, chat_request.filters):
                # chunk can be a string or a dict usually with 'response' key depending on output parser
                # with StrOutputParser it is usually a string
                yield chunk
        
        return StreamingResponse(generate(), media_type="text/plain")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
