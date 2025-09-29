from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from app.utils.embedding import generate_embedding
from app.config.settings import settings


class BookRepository():
    def __init__(self, mongoClient: AsyncIOMotorClient):
        self.mongoClient = mongoClient
        self.database = self.mongoClient[settings.DATABASE_NAME]
        self.collection = self.database[settings.BOOK_COLLECTION_NAME]

    async def get_all(self):
        cursor = self.collection.find()
        return await cursor.to_list(length=1000)
    async def get_k_books(self, limit: int = 10):
        cursor = self.collection.find().limit(limit)
        return cursor
    
    async def get_book_by_field(self, field: str, value: str):
        cursor = self.collection.find({field: {"$regex": value, "$options": "i"}})
        return [doc async for doc in cursor]
    
    async def _book_exist(self, field: str, value):
        return await self.collection.find_one({field: value})

    async def insert_book(self, book: dict):
        if await self._book_exist("ISBN", book["ISBN"]):
            raise ValueError(f"Book ISBN={book['ISBN']}, Name={book['Book-Title']} existed")

        # Sinh embedding từ Title + Author + Category
        text = f"{book.get('Book-Title','')} {book.get('Book-Author','')} {book.get('Category','')}"
        book["embedding"] = generate_embedding(text)

        result = await self.collection.insert_one(book)
        return result.inserted_id

    async def update_book(self, id: ObjectId, update_data: dict):
        if not await self._book_exist("_id", id):
            raise ValueError(f"Book ISBN={update_data.get('ISBN','?')}, Name={update_data.get('Book-Title','?')} not existed")

        # Cập nhật embedding nếu có Title/Author/Category mới
        if any(k in update_data for k in ["Book-Title", "Book-Author", "Category"]):
            text = f"{update_data.get('Book-Title','')} {update_data.get('Book-Author','')} {update_data.get('Category','')}"
            update_data["embedding"] = generate_embedding(text)

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