from app.repository.favoriteGenreRepo import FavoriteGenreRepository
from app.models.favoriteGenre import FavoriteGenreResponse

class FavoriteGenreService:
    def __init__(self, mongoClient):
        self.repo = FavoriteGenreRepository(mongoClient)

    async def add_genre(self, user_id: str, genre: str) -> FavoriteGenreResponse:
        return await self.repo.add(user_id, genre)

    async def remove_genre(self, user_id: str, genre: str) -> int:
        return await self.repo.remove(user_id, genre)

    async def get_user_genres(self, user_id: str):
        return await self.repo.get_by_user(user_id)

    async def get_genre_fans(self, genre: str):
        return await self.repo.get_users_by_genre(genre)
