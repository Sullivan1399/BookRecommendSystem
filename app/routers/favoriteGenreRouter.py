from fastapi import APIRouter, Depends, HTTPException
from app.services.favoriteGenreService import FavoriteGenreService
from app.models.favoriteGenre import FavoriteGenreResponse, FavoriteGenreBase
from app.utils.dependencies import get_favorite_genre_service, get_current_user
from app.models.user import UserResponse

router = APIRouter(prefix="/favorites/genres", tags=["favorite_genres"])

@router.get("/me", response_model=list[FavoriteGenreResponse])
async def get_my_favorite_genres(
    service: FavoriteGenreService = Depends(get_favorite_genre_service),
    current_user: UserResponse = Depends(get_current_user),
    page: int = 1,
    limit: int = 10
):
    favorites = await service.get_user_genres(str(current_user.id))
    start = (page - 1) * limit
    end = start + limit
    return favorites[start:end]

@router.post("/", response_model=FavoriteGenreResponse)
async def add_favorite_genre(
    data: FavoriteGenreBase,   
    service: FavoriteGenreService = Depends(get_favorite_genre_service)
):
    return await service.add_genre(data.user_id, data.genre)

@router.delete("/")
async def remove_favorite_genre(
    genre: str,
    service: FavoriteGenreService = Depends(get_favorite_genre_service),
    current_user: UserResponse = Depends(get_current_user)
):
    deleted = await service.remove_genre(str(current_user.id), genre)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite genre not found")
    return {"deleted_count": deleted}
