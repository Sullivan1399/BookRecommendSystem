from fastapi import APIRouter, Depends

from app.utils.dependencies import get_book_service
from app.services.bookService import BookServices
from app.models.book import BookCreate, BookResponse


router = APIRouter()

@router.get("/", response_model = list[BookResponse])
async def get_all(bookServices: BookServices = Depends(get_book_service)):
    books = await bookServices.get_all()
    return books

@router.get("/search", response_model = list[BookResponse])
async def search(field: str, value: str, 
                 bookServices: BookServices = Depends(get_book_service)):
    books = await bookServices.get_book_by_field(field, value)
    return books

@router.post("/")
async def insert(book: BookCreate,
                 bookServices: BookServices = Depends(get_book_service)):
    inserted_id = await bookServices.insert_book(book.model_dump(by_alias=True))
    return {"inserted_id": inserted_id}

@router.put("/{book_id}")
async def update(id: str, book: BookCreate,
                 bookServices: BookServices = Depends(get_book_service)):
    matched_count = await bookServices.update_book(id, book.model_dump(by_alias=True))
    return {"matched_count": matched_count}

@router.delete("/{book_id}")
async def delete(id: str,
                 bookServices: BookServices = Depends(get_book_service)):
    deleted_count = await bookServices.delete_book(id)
    return {"deleted_count": deleted_count}