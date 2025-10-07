from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List
from bson import ObjectId
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
        if "book_id" in fav and isinstance(fav["book_id"], ObjectId):
            fav["book_id"] = str(fav["book_id"])
        return FavoriteBookResponse(**fav)

    async def add(self, user_id: str, book_id: str) -> FavoriteBookResponse:
        data = {
            "user_id": user_id,
            "book_id": ObjectId(book_id),   # ✅ lưu book_id đúng chuẩn
            "createdAt": datetime.utcnow()
        }
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return self._helper(doc)

    async def remove(self, user_id: str, book_id: str) -> int:
        result = await self.collection.delete_one(
            {"user_id": user_id, "book_id": ObjectId(book_id)}
        )
        return result.deleted_count

    async def get_by_user(self, user_id: str) -> List[FavoriteBookResponse]:
        cursor = self.collection.find({"user_id": user_id})
        return [self._helper(doc) async for doc in cursor]

    async def get_users_by_book(self, book_id: str) -> List[str]:
        cursor = self.collection.find({"book_id": ObjectId(book_id)})
        return [doc["user_id"] async for doc in cursor]
