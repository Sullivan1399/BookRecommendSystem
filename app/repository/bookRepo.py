from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from app.config.settings import settings

class BookRepository():
    def __init__(self, mongoClient: AsyncIOMotorClient):
        self.mongoClient = mongoClient
        self.database = self.mongoClient[settings.DATABASE_NAME]
        self.collection = self.database[settings.BOOK_COLLECTION_NAME]

    async def get_all(self):
        books = self.collection.find()
        return books
    
    async def get_book_by_field(self, field: str, value: str):
        books = self.collection.find({field: {"$regex": value, "$options": "i"}})
        return books
    
    async def _book_exist(self, field: str, value):
        return await self.collection.find_one({field: value})

    async def insert_book(self, book: dict):
        if await self._book_exist("ISBN", book["ISBN"]):
            raise ValueError(f"Book ISBN={book['ISBN']}, Name={book['Book-Title']} existed")
        result = await self.collection.insert_one(book)
        return result.inserted_id

    async def update_book(self, id: ObjectId, update_data: dict):
        if await self._book_exist("_id", id):
            result = await self.collection.update_one({"_id":id}, {"$set": update_data})
            return result.matched_count
        raise ValueError(f"Book ISBN={update_data['ISBN']}, Name={update_data['Book-Title']} not existed")
    
    async def delete_book(self, id: ObjectId):
        if await self._book_exist("_id", id):
            result = await self.collection.delete_one({"_id":id})
            return result.deleted_count
        raise ValueError(f"Book not existed")
        
