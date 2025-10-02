from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List


class BookBase(BaseModel):
    ISBN: str = Field(..., alias="ISBN")
    title: str = Field(..., alias="Book-Title")
    author: str = Field(..., alias="Book-Author")
    yop: int = Field(..., alias="Year-Of-Publication")
    publisher: str = Field(..., alias="Publisher")
    category: Optional[str] = Field(None, alias="Category")
    description: Optional[str] = Field(None, alias="Description")
    imageS: str = Field(..., alias="Image-URL-S")
    imageM: str = Field(..., alias="Image-URL-M")
    imageL: str = Field(..., alias="Image-URL-L")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: Optional[str] = Field(None, alias="_id")
    embedding: Optional[List[float]] = None
    score: Optional[float] = None 
