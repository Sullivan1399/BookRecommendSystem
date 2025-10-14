from fastapi import APIRouter, Depends, HTTPException
from typing import List
import asyncio

from app.models.book import BookResponse
from app.utils.dependencies import get_current_user
from app.models.user import UserResponse
from app.services.recommendService import RecommendService, get_recommender
from app.repository.bookRepo import BookRepository
from app.repository.userRepo import UserRepository
from app.config.database import get_mongodb_client_singleton

router = APIRouter()

recommender = get_recommender()

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

@router.get("/item/{isbn}", response_model=List[str])
async def recommend_item(isbn: str, k: int = 10, method: str = "hybrid"):
    # method: 'topk' | 'nn' | 'content' | 'hybrid'
    svc = recommender
    loop = asyncio.get_event_loop()

    if method == "topk":
        # immediate, in-memory
        return svc.recommend_by_isbn_topk(isbn, k)
    elif method == "nn":
        # NN may be heavier; run in executor
        return await loop.run_in_executor(None, svc.recommend_by_isbn_nn, isbn, k)
    elif method == "content":
        return await loop.run_in_executor(None, svc.recommend_content_by_isbn, isbn, k)
    else:  # hybrid
        return await loop.run_in_executor(None, svc.recommend_hybrid, isbn, k)

@router.get("/user/{user_id}", response_model=List[str])
async def recommend_for_user(user_id: str, k: int = 10):
    user = await UserRepository.find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    favs = user.get("favorite_books", [])
    svc = recommender
    loop = asyncio.get_event_loop()
    recs = []
    # aggregate neighbors for favorites
    for isbn in favs:
        neighbors = await loop.run_in_executor(None, svc.recommend_by_isbn_topk, isbn, k*2)
        for nb in neighbors:
            if nb not in favs and nb not in recs:
                recs.append(nb)
            if len(recs) >= k:
                break
        if len(recs) >= k:
            break
    # fallback to popular if empty
    if not recs:
        pop = await BookRepository.get_popular_books(limit = k)
        return [b["ISBN"] for b in pop]
    return recs[:k]