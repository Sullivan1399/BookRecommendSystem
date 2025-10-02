from fastapi import APIRouter, Depends, HTTPException
from app.services.favoriteGenreService import FavoriteGenreService
from app.models.favoriteGenre import FavoriteGenreResponse
from app.utils.dependencies import get_favorite_genre_service

router = APIRouter(prefix="/favorites/genres", tags=["favorite_genres"])

@router.post("/", response_model=FavoriteGenreResponse)
async def add_favorite_genre(user_id: str, genre: str,
                             service: FavoriteGenreService = Depends(get_favorite_genre_service)):
    return await service.add_genre(user_id, genre)

@router.delete("/")
async def remove_favorite_genre(user_id: str, genre: str,
                                service: FavoriteGenreService = Depends(get_favorite_genre_service)):
    deleted = await service.remove_genre(user_id, genre)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite genre not found")
    return {"deleted_count": deleted}

@router.get("/user/{user_id}", response_model=list[FavoriteGenreResponse])
async def get_user_favorite_genres(user_id: str,
                                   service: FavoriteGenreService = Depends(get_favorite_genre_service)):
    return await service.get_user_genres(user_id)

@router.get("/genre/{genre}", response_model=list[str])
async def get_users_by_genre(genre: str,
                             service: FavoriteGenreService = Depends(get_favorite_genre_service)):
    return await service.get_genre_fans(genre)
