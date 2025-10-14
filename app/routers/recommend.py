# app/routers/recommend.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
import asyncio
from app.services.recommendService import get_recommender
from app.repository.bookRepo import BookRepository
from app.repository.userRepo import UserRepository

router = APIRouter()

recommender = get_recommender()

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
