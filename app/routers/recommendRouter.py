# app/routers/recommendRouter.py
from fastapi import APIRouter, Depends
from app.models.book import BookResponse
from app.utils.dependencies import get_current_user
from app.models.user import UserResponse
from app.services.recommendService import RecommendService
from app.config.database import get_mongodb_client_singleton

router = APIRouter(prefix="/recommend", tags=["recommend"])

def get_recommend_service() -> RecommendService:
    client = get_mongodb_client_singleton()
    return RecommendService(client)

@router.get("/books", response_model=list[BookResponse])
async def recommend_books(
    current_user: UserResponse = Depends(get_current_user),
    service: RecommendService = Depends(get_recommend_service),
    top_k: int = 5
):
    """
    Gợi ý sách dựa trên favorite books & favorite genres của người dùng.
    """
    return await service.recommend_books_for_user(str(current_user.id), top_k)
