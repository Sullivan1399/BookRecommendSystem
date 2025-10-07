from fastapi import APIRouter, Depends, HTTPException
from app.services.favoriteBookService import FavoriteBookService
from app.models.book import BookResponse
from app.utils.dependencies import get_favorite_book_service, get_current_user
from app.models.user import UserResponse

router = APIRouter(prefix="/favorites/book", tags=["favorite_book"])


@router.get("/me", response_model=list[BookResponse])
async def get_my_favorite_books(
    service: FavoriteBookService = Depends(get_favorite_book_service),
    current_user: UserResponse = Depends(get_current_user),
    page: int = 1,
    limit: int = 10
):
    books = await service.get_user_books_full(str(current_user.id))
    start = (page - 1) * limit
    end = start + limit
    return books[start:end]


@router.post("/", response_model=BookResponse)
async def add_favorite_book(
    book_id: str,
    service: FavoriteBookService = Depends(get_favorite_book_service),
    current_user: UserResponse = Depends(get_current_user)
):
    await service.add_book(str(current_user.id), book_id)
    books = await service.get_user_books_full(str(current_user.id))
    return next((b for b in books if b.id == book_id), None)


@router.delete("/")
async def remove_favorite_book(
    book_id: str,
    service: FavoriteBookService = Depends(get_favorite_book_service),
    current_user: UserResponse = Depends(get_current_user)
):
    deleted = await service.remove_book(str(current_user.id), book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite book not found")
    return {"deleted_count": deleted}
