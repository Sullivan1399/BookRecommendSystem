from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List


class RatingBase(BaseModel):
    userID: Optional[str] = Field(None, alias="User-ID")
    ISBN: str = Field(..., alias="ISBN")
    rating: int = Field(..., alias="Book-Rating")
    text: Optional[str] = Field(None, alias="Text")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class RatingCreate(RatingBase):
    pass


class BookResponse(RatingBase):
    id: Optional[str] = Field(None, alias="_id")

class RatingWithUser(RatingBase):
    FullName: Optional[str] = None
    Username: Optional[str] = None
