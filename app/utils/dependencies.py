from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.config.settings import settings
from app.services.bookService import BookServices
from app.services.userService import UserService
from app.services.favoriteBookService import FavoriteBookService
from app.services.favoriteGenreService import FavoriteGenreService
from app.config.database import get_mongodb_client_singleton
from app.chatbot.ollama_client import OllamaClientSingleton
from app.chatbot.groq_client import GroqClient
from app.services.chatbotService import ChatbotService


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_book_service() -> BookServices:
    mongoClient = get_mongodb_client_singleton()
    return BookServices(mongoClient)

def get_user_service() -> UserService:
    mongoClient = get_mongodb_client_singleton()
    return UserService(mongoClient)

def get_favorite_book_service() -> FavoriteBookService:
    mongoClient = get_mongodb_client_singleton()
    return FavoriteBookService(mongoClient)
    

def get_favorite_genre_service() -> FavoriteGenreService:
    mongoClient = get_mongodb_client_singleton()
    return FavoriteGenreService(mongoClient)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    userService: UserService = Depends(get_user_service)
):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = await userService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


async def get_current_admin(current_user=Depends(get_current_user)):
    """Chỉ cho phép admin"""
    if not current_user.admin_status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins only"
        )
    return current_user

async def get_ollama_client() -> OllamaClientSingleton:
    return OllamaClientSingleton()

async def get_gptoss_client() -> GroqClient:
    return GroqClient()

def get_chatbot_service(
    ollama_client: OllamaClientSingleton = Depends(get_ollama_client),
    gptoss_client: GroqClient = Depends(get_gptoss_client)
) -> ChatbotService:
    return ChatbotService(ollama_client, gptoss_client)