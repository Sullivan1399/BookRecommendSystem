from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FavoriteBookBase(BaseModel):
    user_id: str = Field(..., alias="user_id")
    isbn: str = Field(..., alias="isbn")

class FavoriteBookCreate(FavoriteBookBase):
    pass

class FavoriteBookResponse(FavoriteBookBase):
    id: Optional[str] = Field(None, alias="_id")
    createdAt: Optional[datetime] = Field(None, alias="createdAt")
