from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FavoriteBookBase(BaseModel):
    user_id: str = Field(..., alias="user_id")
    book_id: str = Field(..., alias="book_id")

class FavoriteBookCreate(FavoriteBookBase):
    pass

class FavoriteBookResponse(FavoriteBookBase):
    id: Optional[str] = Field(None, alias="_id")
