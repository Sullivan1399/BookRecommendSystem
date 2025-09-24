from datetime import datetime
from typing import Optional
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.config.settings import settings


class UserRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        self.mongoClient = mongoClient
        self.database = self.mongoClient[settings.DATABASE_NAME]
        self.collection = self.database[settings.USER_COLLECTION_NAME]

    def _user_helper(self, user: dict) -> Optional[UserResponse]:
        """Convert MongoDB dict -> UserResponse"""
        if not user:
            return None
        user["_id"] = str(user["_id"])  # convert ObjectId -> str
        return UserResponse(**user)

    async def insert_user(self, user_data: dict) -> UserResponse:
        """Insert raw dict user_data vào DB"""
        result = await self.collection.insert_one(user_data)
        created = await self.collection.find_one({"_id": result.inserted_id})
        return self._user_helper(created)

    async def find_user_by_id(self, user_id: str) -> Optional[UserResponse]:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return self._user_helper(user)

    async def find_user_by_email(self, email: str) -> Optional[UserResponse]:
        user = await self.collection.find_one({"email": email})
        return self._user_helper(user)

    async def find_user_by_username(self, username: str) -> Optional[UserResponse]:
        user = await self.collection.find_one({"username": username})
        return self._user_helper(user)

    async def update_user(self, user_id: str, update_data: dict) -> Optional[UserResponse]:
        """Update raw dict update_data"""
        update_data["updatedAt"] = datetime.utcnow()
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return None
        return await self.find_user_by_id(user_id)

    async def update_user_wishlist(self, user_id: str, book_id: str) -> Optional[UserResponse]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"wishlist": book_id},
                "$set": {"updatedAt": datetime.utcnow()},
            }
        )
        if result.matched_count == 0:
            return None
        return await self.find_user_by_id(user_id)

    async def update_user_favorites(self, user_id: str, book_id: str) -> Optional[UserResponse]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$addToSet": {"favorite_books": book_id},
                "$set": {"updatedAt": datetime.utcnow()},
            }
        )
        if result.matched_count == 0:
            return None
        return await self.find_user_by_id(user_id)

    async def add_reading_history(self, user_id: str, history_item: dict) -> Optional[UserResponse]:
        result = await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$push": {"readingHistory": history_item},
                "$set": {"updatedAt": datetime.utcnow()},
            }
        )
        if result.matched_count == 0:
            return None
        return await self.find_user_by_id(user_id)
