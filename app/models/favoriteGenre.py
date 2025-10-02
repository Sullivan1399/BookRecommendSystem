from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class FavoriteGenreBase(BaseModel):
    user_id: str = Field(..., alias="user_id")
    genre: str = Field(..., alias="genre")

class FavoriteGenreCreate(FavoriteGenreBase):
    pass

class FavoriteGenreResponse(FavoriteGenreBase):
    id: Optional[str] = Field(None, alias="_id")
    createdAt: Optional[datetime] = Field(None, alias="createdAt")
