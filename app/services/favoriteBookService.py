from app.repository.favoriteBookRepo import FavoriteBookRepository
from app.models.favoriteBook import FavoriteBookResponse

class FavoriteBookService:
    def __init__(self, mongoClient):
        self.repo = FavoriteBookRepository(mongoClient)

    async def add_book(self, user_id: str, isbn: str) -> FavoriteBookResponse:
        return await self.repo.add(user_id, isbn)

    async def remove_book(self, user_id: str, isbn: str) -> int:
        return await self.repo.remove(user_id, isbn)

    async def get_user_books(self, user_id: str):
        return await self.repo.get_by_user(user_id)

    async def get_book_fans(self, isbn: str):
        return await self.repo.get_users_by_book(isbn)
