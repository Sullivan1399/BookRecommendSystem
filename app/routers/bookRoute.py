from fastapi import APIRouter, Depends, HTTPException, status

from app.utils.dependencies import get_book_service,  get_current_admin
from app.services.bookService import BookServices
from app.models.book import BookCreate, BookResponse
from typing import List
from fastapi import Body

router = APIRouter()

@router.get("/", response_model=list[BookResponse])
async def get_all(bookServices: BookServices = Depends(get_book_service)):
    return await bookServices.get_all()

@router.get("/page", response_model=list[BookResponse])
async def get_books_paginated(
    page: int = 1, 
    limit: int = 10, 
    bookServices: BookServices = Depends(get_book_service)
):
    return await bookServices.get_books_paginated(page, limit)


@router.get("/search", response_model=list[BookResponse])
async def search(field: str, value: str,
                 bookServices: BookServices = Depends(get_book_service)):
    return await bookServices.get_book_by_field(field, value)

@router.post("/", dependencies=[Depends(get_current_admin)])
async def insert(book: BookCreate,
                 bookServices: BookServices = Depends(get_book_service)):
    inserted_id = await bookServices.insert_book(book.model_dump(by_alias=True))
    return {"inserted_id": inserted_id}

@router.put("/{book_id}", dependencies=[Depends(get_current_admin)])
async def update(book_id: str, book: BookCreate,
                 bookServices: BookServices = Depends(get_book_service)):
    matched_count = await bookServices.update_book(book_id, book.model_dump(by_alias=True))
    return {"matched_count": matched_count}

@router.delete("/{book_id}", dependencies=[Depends(get_current_admin)])
async def delete(book_id: str,
                 bookServices: BookServices = Depends(get_book_service)):
    deleted_count = await bookServices.delete_book(book_id)
    return {"deleted_count": deleted_count}
@router.get("/vector_search", response_model=list[BookResponse])
async def vector_search(query: str, k: int = 5,
                        bookServices: BookServices = Depends(get_book_service)):
    return await bookServices.vector_search(query, k)

@router.get("/latest", response_model=list[BookResponse])
async def get_latest_books(
    k: int = 10,
    bookServices: BookServices = Depends(get_book_service)
):
    return await bookServices.get_latest_books(k)

@router.post("/by_isbn", response_model=list[BookResponse])
async def get_books_by_isbn(
    isbn_list: List[str] = Body(..., example=[
        "0373785070", "0394535979", "0446679100"
    ]),
    bookServices: BookServices = Depends(get_book_service)
):
    """
    Trả về danh sách sách theo danh sách ISBN.
    """
    return await bookServices.get_books_by_isbn_list(isbn_list)