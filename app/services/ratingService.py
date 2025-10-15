from bson import ObjectId
from app.repository.ratingRepo import RatingRepository
from app.repository.userRepo import UserRepository
from typing import Optional, List
from fastapi import HTTPException, status


class RatingService:
    def __init__(self, mongoClient):
        self.repo = RatingRepository(mongoClient)
        self.user_repo = UserRepository(mongoClient)

    async def add_rating_once(self, user_id: str, isbn: str, rating: int, text: Optional[str] = None):
        """
        Chỉ cho phép người dùng đánh giá 1 lần cho mỗi sách.
        """
        existing = await self.repo.find_by_user_and_isbn(user_id, isbn)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Bạn đã đánh giá sách này rồi. Không thể đánh giá lại."
            )

        return await self.repo.insert_rating(user_id, isbn, rating, text)

    async def get_user_rating(self, user_id: str, isbn: str):
        doc = await self.repo.get_user_rating(user_id, isbn)
        if not doc:
            return None
        user = await self.user_repo.find_user_by_id(user_id)
        if user:
            doc["User"] = user.model_dump(exclude_none=True)
        return doc

    async def get_ratings_for_book(self, isbn: str):
        # Lấy luôn từ lookup
        return await self.repo.get_ratings_for_book(isbn)

    async def get_average_rating_for_book(self, isbn: str):
        return await self.repo.get_average_rating_for_book(isbn)
