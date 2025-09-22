from bson import ObjectId

from app.repository.bookRepo import BookRepository
from app.models.book import BookResponse
from app.schema.bookSchema import list_serial

class BookServices():
    def __init__(self, mongoClient):
        self.bookRepository = BookRepository(mongoClient)

    def _convert_id_to_str(self, books: list[dict]) -> list[dict]:
        for book in books:
            if "_id" in book and isinstance(book["_id"], ObjectId):
                book["_id"] = str(book["_id"])
        return books
    
    def _convert_to_ObjectID(self, id: str):
        object_id = None
        try:
            object_id = ObjectId(id)
            return object_id
        except Exception:
            raise ValueError("Invalid id format")
    
    async def get_all(self):
        cursor = await self.bookRepository.get_all()
        books = await cursor.to_list(length=1000)
        # return list_serial(books)
        books = self._convert_id_to_str(books)
        return [BookResponse(**book) for book in books] 
    
    async def get_book_by_field(self, field: str, value: str):
        cursor = await self.bookRepository.get_book_by_field(field, value)
        books = await cursor.to_list(length=1000)
        # return list_serial(books)
        books = self._convert_id_to_str(books)
        return [BookResponse(**book) for book in books] 

    async def insert_book(self, book: dict):
        inserted_id = await self.bookRepository.insert_book(book)
        return str(inserted_id)

    async def update_book(self, id: str, book):
        objetcId = self._convert_to_ObjectID(id)
        matched_count = await self.bookRepository.update_book(objetcId, book)
        return str(matched_count)

    async def delete_book(self, id: str):
        objetcId = self._convert_to_ObjectID(id)
        deleted_count = await self.bookRepository.delete_book(objetcId)
        return str(deleted_count)
