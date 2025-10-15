from app.repository.favoriteGenreRepo import FavoriteGenreRepository
from app.models.favoriteGenre import FavoriteGenreResponse
from fastapi import HTTPException
class FavoriteGenreService:
    def __init__(self, mongoClient):
        self.repo = FavoriteGenreRepository(mongoClient)

    async def add_genre(self, user_id: str, genre: str) -> FavoriteGenreResponse:
        #  Kiểm tra xem đã tồn tại chưa
        existing_genres = await self.repo.get_by_user(user_id)
        if any(fav.genre.lower() == genre.lower() for fav in existing_genres):
            #  Trả lỗi 400, không phải lỗi hệ thống
            raise HTTPException(
                status_code=400,
                detail=f"Thể loại '{genre}' đã có trong danh sách yêu thích."
            )
        
        # Nếu chưa có thì thêm mới
        return await self.repo.add(user_id, genre)

    async def remove_genre(self, user_id: str, genre: str) -> int:
        return await self.repo.remove(user_id, genre)

    async def get_user_genres(self, user_id: str):
        return await self.repo.get_by_user(user_id)

    async def get_genre_fans(self, genre: str):
        return await self.repo.get_users_by_genre(genre)
