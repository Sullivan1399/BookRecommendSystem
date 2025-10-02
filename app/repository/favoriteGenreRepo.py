from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List
from app.config.settings import settings
from app.models.favoriteGenre import FavoriteGenreResponse

class FavoriteGenreRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        db = mongoClient[settings.DATABASE_NAME]
        self.collection = db["favorite_genres"]

    def _helper(self, fav: dict):
        if not fav:
            return None
        fav["_id"] = str(fav["_id"])
        return FavoriteGenreResponse(**fav)

    async def add(self, user_id: str, genre: str) -> FavoriteGenreResponse:
        data = {"user_id": user_id, "genre": genre, "createdAt": datetime.utcnow()}
        result = await self.collection.insert_one(data)
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return self._helper(doc)

    async def remove(self, user_id: str, genre: str) -> int:
        result = await self.collection.delete_one({"user_id": user_id, "genre": genre})
        return result.deleted_count

    async def get_by_user(self, user_id: str) -> List[FavoriteGenreResponse]:
        cursor = self.collection.find({"user_id": user_id})
        return [self._helper(doc) async for doc in cursor]

    async def get_users_by_genre(self, genre: str) -> List[str]:
        cursor = self.collection.find({"genre": genre})
        return [doc["user_id"] async for doc in cursor]
