from app.services import bookService
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.config.settings import settings
from app.services.bookService import BookServices
from app.services.userService import UserService
from app.config.database import get_mongodb_client_singleton


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_book_service():
    mongoClient = get_mongodb_client_singleton()
    return bookService.BookServices(mongoClient)

def get_user_service() -> UserService:
    mongoClient = get_mongodb_client_singleton()
    return UserService(mongoClient)

async def get_current_user(token: str = Depends(oauth2_scheme),
                           userService: UserService = Depends(get_user_service)):
    """Giải mã JWT và trả về user hiện tại"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user = await userService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


async def get_current_admin(current_user=Depends(get_current_user)):
    """Chỉ cho phép admin"""
    if not current_user.admin_status:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    return current_user