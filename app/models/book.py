from pydantic import BaseModel, Field, ConfigDict, field_serializer
from typing import Optional


class BookBase(BaseModel):
    ISBN: str = Field(..., alias="ISBN")
    title: str = Field(..., alias="Book-Title")
    author: str = Field(..., alias="Book-Author")
    yop: int = Field(..., alias="Year-Of-Publication")
    publisher: str = Field(..., alias="Publisher")
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
    # id: str
    # @field_serializer("id", when_used="always")
    # def serialize_id(self, v: ObjectId) -> str:
    #     return str(v)