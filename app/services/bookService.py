from bson import ObjectId
from app.utils.embedding import generate_embedding
from app.repository.bookRepo import BookRepository
from app.repository.bookEmbeddingRepo import BookEmbeddingRepository
from app.models.book import BookResponse

class BookServices():
    def __init__(self, mongoClient):
        self.bookRepository = BookRepository(mongoClient)
        self.embeddingRepo = BookEmbeddingRepository(mongoClient)

    def _convert_id_to_str(self, books: list[dict]) -> list[dict]:
        for book in books:
            if "_id" in book and isinstance(book["_id"], ObjectId):
                book["_id"] = str(book["_id"])
        return books
    
    async def get_all(self):
        books = await self.bookRepository.get_all()
        books = self._convert_id_to_str(books)
        return [BookResponse(**book) for book in books]
    
    async def get_books_paginated(self, page: int = 1, limit: int = 10):
        books = await self.bookRepository.get_books_paginated(page, limit)
        books = self._convert_id_to_str(books)
        return [BookResponse(**book) for book in books]


    async def get_book_by_field(self, field: str, value: str):
        books = await self.bookRepository.get_book_by_field(field, value)
        books = self._convert_id_to_str(books)
        return [BookResponse(**book) for book in books]

    async def insert_book(self, book: dict):
        result = await self.bookRepository.insert_book(book)
        text = f"{book.get('Book-Title','')} {book.get('Book-Author','')} {book.get('Category','')} {book.get('Description','')}"
        embedding = generate_embedding(text)
        await self.embeddingRepo.insert(book["ISBN"], embedding)
        return str(result)

    async def update_book(self, id: str, update_data: dict):
        obj_id = ObjectId(id)
        book = await self.bookRepository.get_book_by_id(obj_id)
        if not book:
            raise ValueError("Book not found")

        await self.bookRepository.update_book(obj_id, update_data)

        if any(k in update_data for k in ["Book-Title", "Book-Author", "Category", "Description"]):
            text = f"{update_data.get('Book-Title', book.get('Book-Title',''))} {update_data.get('Book-Author', book.get('Book-Author',''))} {update_data.get('Category', book.get('Category',''))} {update_data.get('Description', book.get('Description',''))}"
            embedding = generate_embedding(text)
            await self.embeddingRepo.update(book["ISBN"], embedding)

        return str(obj_id)

    async def delete_book(self, book_id: str):
        obj_id = ObjectId(book_id)
        book = await self.bookRepository.get_book_by_id(obj_id)
        if not book:
            raise ValueError("Book not found")
        await self.embeddingRepo.delete(book["ISBN"])
        deleted_count = await self.bookRepository.delete_book(obj_id)
        return deleted_count

    async def vector_search(self, query: str, k: int = 5):
        query_embedding = generate_embedding(query)
        results = await self.embeddingRepo.vector_search(query_embedding, k)
        return [BookResponse(**r) for r in results] 

    async def get_latest_books(self, limit: int = 10):
        docs = await self.bookRepository.get_latest_books(limit)
        return [BookResponse(**doc) for doc in docs]

