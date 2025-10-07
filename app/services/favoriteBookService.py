from app.repository.favoriteBookRepo import FavoriteBookRepository
from app.models.favoriteBook import FavoriteBookResponse
from app.models.book import BookResponse
from app.repository.bookRepo import BookRepository
from bson import ObjectId

class FavoriteBookService:
    def __init__(self, mongoClient):
        self.repo = FavoriteBookRepository(mongoClient)
        self.bookRepo= BookRepository(mongoClient)
    
    async def add_book(self, user_id: str, book_id: str):
        return await self.repo.add(user_id, book_id)

    async def remove_book(self, user_id: str, book_id: str):
        return await self.repo.remove(user_id, book_id)

    async def get_user_books_full(self, user_id: str):
        favorites = await self.repo.get_by_user(user_id)
        book_ids = [ObjectId(fav.book_id) for fav in favorites]

        if not book_ids:
            return []

        cursor = self.bookRepo.collection.find({"_id": {"$in": book_ids}})
        books = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            books.append(BookResponse(**doc))
        return books

    async def get_book_fans(self, book_id: str):
        return await self.repo.get_users_by_book(book_id)

    # async def get_book_fans(self, book_id: str):
    #     return await self.repo.get_users_by_book(book_id)
