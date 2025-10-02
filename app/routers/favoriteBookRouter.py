from fastapi import APIRouter, Depends, HTTPException
from app.services.favoriteBookService import FavoriteBookService
from app.models.favoriteBook import FavoriteBookResponse
from app.utils.dependencies import get_favorite_book_service

router = APIRouter(prefix="/favorites/books", tags=["favorite_books"])

@router.post("/", response_model=FavoriteBookResponse)
async def add_favorite_book(user_id: str, isbn: str,
                            service: FavoriteBookService = Depends(get_favorite_book_service)):
    return await service.add_book(user_id, isbn)

@router.delete("/")
async def remove_favorite_book(user_id: str, isbn: str,
                               service: FavoriteBookService = Depends(get_favorite_book_service)):
    deleted = await service.remove_book(user_id, isbn)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite book not found")
    return {"deleted_count": deleted}

@router.get("/user/{user_id}", response_model=list[FavoriteBookResponse])
async def get_user_favorite_books(user_id: str,
                                  service: FavoriteBookService = Depends(get_favorite_book_service)):
    return await service.get_user_books(user_id)

@router.get("/book/{isbn}", response_model=list[str])
async def get_users_by_book(isbn: str,
                            service: FavoriteBookService = Depends(get_favorite_book_service)):
    return await service.get_book_fans(isbn)
