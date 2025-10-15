from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.models.rating import RatingCreate, RatingBase, RatingWithUser
from app.models.user import UserResponse
from app.services.ratingService import RatingService
from app.utils.dependencies import get_rating_service, get_current_user

router = APIRouter(prefix="/ratings", tags=["ratings"])

@router.post("/", response_model=dict, status_code=status.HTTP_201_CREATED)
async def add_rating(
    payload: RatingCreate,
    current_user: UserResponse = Depends(get_current_user),
    service: RatingService = Depends(get_rating_service)
):
    """
     Thêm rating mới (1 user chỉ được 1 lần / 1 sách)
    """
    user_id = getattr(current_user, "User_ID", str(current_user.id))
    await service.add_rating_once(user_id, payload.ISBN, payload.rating, payload.text)
    return {"message": "Rating added successfully."}


@router.get("/{isbn}", response_model=RatingBase)
async def get_user_rating(
    isbn: str,
    current_user: UserResponse = Depends(get_current_user),
    service: RatingService = Depends(get_rating_service)
):
    """
     Lấy rating của user hiện tại cho một sách.
    """
    user_id = getattr(current_user, "User_ID", str(current_user.id))
    doc = await service.get_user_rating(user_id, isbn)
    if not doc:
        raise HTTPException(status_code=404, detail="Rating not found")
    return doc


@router.get("/book/{isbn}", response_model=List[RatingWithUser])
async def get_ratings_for_book(
    isbn: str,
    service: RatingService = Depends(get_rating_service)
):
    return await service.get_ratings_for_book(isbn)



@router.get("/book/{isbn}/avg", response_model=dict)
async def get_average_rating_for_book(
    isbn: str,
    service: RatingService = Depends(get_rating_service)
):
    """
     Tính điểm trung bình rating cho sách.
    """
    avg = await service.get_average_rating_for_book(isbn)
    return {"ISBN": isbn, "average_rating": round(avg, 2)}
