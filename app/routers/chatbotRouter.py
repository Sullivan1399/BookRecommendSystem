from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse

from app.models.chatRequest import ChatRequest
from app.chatbot.ollama_client import OllamaClientSingleton
from app.chatbot.groq_client import GroqClient
from app.services.chatbotService import ChatbotService
from app.utils.dependencies import get_chatbot_service

router = APIRouter()

@router.post("/")
async def chat(
    request: ChatRequest,
    chat_service: ChatbotService = Depends(get_chatbot_service)
):
    if not request.query:
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống.")

    if request.model_source == "ollama":
        try:
            stream = chat_service.stream_response_ollama(request.query)
            return StreamingResponse(stream, media_type="text/event-stream")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi giao tiếp với LLM: {e}")

    elif request.model_source == "groq":
        try:
            stream = chat_service.stream_response_groq(request.query)
            return StreamingResponse(stream, media_type="text/event-stream")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Lỗi khi giao tiếp với LLM: {e}")
    else:
        raise HTTPException(status_code=400, detail="Unknown model_source")