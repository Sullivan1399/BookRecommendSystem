from app.services import bookService
from app.config.database import get_mongodb_client_singleton

def get_book_service():
    mongoClient = get_mongodb_client_singleton()
    return bookService.BookServices(mongoClient)