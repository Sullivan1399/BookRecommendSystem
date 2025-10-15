from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from typing import List, Optional
from app.config.settings import settings


class RatingRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        db = mongoClient[settings.DATABASE_NAME]
        self.collection = db["rating"]

    async def find_by_user_and_isbn(self, user_id: str, isbn: str):
        """Tìm xem user đã rating sách này chưa"""
        return await self.collection.find_one({"User-ID": user_id, "ISBN": isbn})

    async def insert_rating(self, user_id: str, isbn: str, rating: int, text: Optional[str] = None):
        """Thêm rating mới"""
        data = {
            "User-ID": user_id,
            "ISBN": isbn,
            "Book-Rating": rating,
            "Text": text,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
        }
        result = await self.collection.insert_one(data)
        return result.inserted_id

    async def get_user_rating(self, user_id: str, isbn: str):
        doc = await self.collection.find_one({"User-ID": user_id, "ISBN": isbn})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def get_ratings_for_book(self, isbn: str) -> List[dict]:
        """
        Lấy tất cả rating cho 1 sách, join thông tin user (username + fullName)
        """
        pipeline = [
            {"$match": {"ISBN": isbn}},

            #  Ép kiểu User-ID sang ObjectId (chỉ khi hợp lệ)
            {
                "$addFields": {
                    "user_id_obj": {
                        "$cond": {
                            "if": {"$regexMatch": {"input": "$User-ID", "regex": "^[0-9a-fA-F]{24}$"}},
                            "then": {"$toObjectId": "$User-ID"},
                            "else": None
                        }
                    }
                }
            },

            #  Join với collection users
            {
                "$lookup": {
                    "from": "User", 
                    "localField": "user_id_obj",
                    "foreignField": "_id",
                    "as": "user_info"
                }
            },

            {"$unwind": {"path": "$user_info", "preserveNullAndEmptyArrays": True}},

            #  Chỉ lấy các trường cần thiết
            {
                "$project": {
                    "_id": {"$toString": "$_id"},
                    "User-ID": 1,
                    "ISBN": 1,
                    "Book-Rating": 1,
                    "Text": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "Username": "$user_info.username",
                    "FullName": "$user_info.fullName"
                }
            }
        ]

        cursor = self.collection.aggregate(pipeline)
        docs = [doc async for doc in cursor]
        return docs

    async def get_average_rating_for_book(self, isbn: str) -> float:
        pipeline = [
            {"$match": {"ISBN": isbn, "Book-Rating": {"$gt": 0}}},
            {"$group": {"_id": "$ISBN", "avg_rating": {"$avg": "$Book-Rating"}}}
        ]
        cursor = self.collection.aggregate(pipeline)
        docs = [doc async for doc in cursor]
        return docs[0]["avg_rating"] if docs else 0.0
