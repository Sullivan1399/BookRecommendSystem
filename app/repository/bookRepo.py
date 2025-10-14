from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Dict, Any
from app.config.settings import settings

class BookRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        self.mongoClient = mongoClient
        self.database = self.mongoClient[settings.DATABASE_NAME]
        self.collection = self.database[settings.BOOK_COLLECTION_NAME]

    async def get_all(self, limit: int = 1000):
        cursor = self.collection.find().limit(limit)
        return [doc async for doc in cursor]

    async def get_book_by_id(self, id: ObjectId):
        return await self.collection.find_one({"_id": id})
    
    async def get_books_paginated(self, page: int = 1, limit: int = 10):
        skip = (page - 1) * limit
        cursor = self.collection.find().skip(skip).limit(limit)
        return [doc async for doc in cursor]
    
    async def get_book_by_field(self, field: str, value: str):
        cursor = self.collection.find({field: {"$regex": value, "$options": "i"}})
        return [doc async for doc in cursor]
    
    async def _book_exist(self, field: str, value):
        return await self.collection.find_one({field: value})

    async def insert_book(self, book: dict):
        if await self._book_exist("ISBN", book["ISBN"]):
            raise ValueError(f"Book ISBN={book['ISBN']}, Name={book['Book-Title']} existed")
        result = await self.collection.insert_one(book)
        return result.inserted_id

    async def update_book(self, id: ObjectId, update_data: dict):
        if not await self._book_exist("_id", id):
            raise ValueError(f"Book with _id={id} not existed")
        result = await self.collection.update_one({"_id": id}, {"$set": update_data})
        return result.matched_count
    
    async def delete_book(self, id: ObjectId):
        if not await self._book_exist("_id", id):
            raise ValueError("Book not existed")
        result = await self.collection.delete_one({"_id": id})
        return result.deleted_count

    async def aggregate(self, pipeline: list):
        cursor = self.collection.aggregate(pipeline)
        return [doc async for doc in cursor]

    async def get_latest_books(self, limit: int = 10):
        cursor = self.collection.find().sort("Year-Of-Publication", -1).limit(limit)
        books = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            books.append(doc)
        return books
    
    async def get_popular_books(self, limit: int = 10, min_ratings: int = 1, sort_by: str = "ratingCount"):
        if sort_by not in ("ratingCount", "avgRating"):
            sort_by = "ratingCount"
        rating_coll = self.database[settings.RATING_COLLECTION_NAME]
        pipeline = [
            {"$group": {"_id": "$ISBN", "ratingCount": {"$sum": 1}, "avgRating": {"$avg": "$Book-Rating"}}},
            {"$match": {"ratingCount": {"$gte": min_ratings}}},
            {"$sort": {sort_by: -1}},
            {"$limit": limit},
            {"$lookup": {"from": settings.BOOK_COLLECTION_NAME, "localField": "_id", "foreignField": "ISBN", "as": "book"}},
            {"$unwind": {"path": "$book", "preserveNullAndEmptyArrays": True}},
            {"$project": {"_id": 0, "ISBN": "$_id", "ratingCount": 1, "avgRating": {"$round": ["$avgRating", 2]}, "book": 1}}
        ]
        cursor = rating_coll.aggregate(pipeline)
        return [doc async for doc in cursor]
    
    # return list isbn only
    async def get_popular_isbns(
        self,
        limit: int = 10,
        min_ratings: int = 1,
        sort_by: str = "ratingCount"
    ) -> List[str]:
        docs = await self.get_popular_books(limit=limit, min_ratings=min_ratings, sort_by=sort_by)
        return [d["ISBN"] for d in docs if "ISBN" in d]

