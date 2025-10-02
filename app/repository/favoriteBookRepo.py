from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List
from app.config.settings import settings
from app.models.favoriteBook import FavoriteBookResponse

class FavoriteBookRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        db = mongoClient[settings.DATABASE_NAME]
        self.collection = db["favorite_books"]

    def _helper(self, fav: dict):
        if not fav:
            return None
        fav["_id"] = str(fav["_id"])
        return FavoriteBookResponse(**fav)

    async def add(self, user_id: str, isbn: str) -> FavoriteBookResponse:
        data = {"user_id": user_id, "isbn": isbn, "createdAt": datetime.utcnow()}
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return self._helper(doc)

    async def remove(self, user_id: str, isbn: str) -> int:
        result = await self.collection.delete_one({"user_id": user_id, "isbn": isbn})
        return result.deleted_count

    async def get_by_user(self, user_id: str) -> List[FavoriteBookResponse]:
        cursor = self.collection.find({"user_id": user_id})
        return [self._helper(doc) async for doc in cursor]

    async def get_users_by_book(self, isbn: str) -> List[str]:
        cursor = self.collection.find({"isbn": isbn})
        return [doc["user_id"] async for doc in cursor]
