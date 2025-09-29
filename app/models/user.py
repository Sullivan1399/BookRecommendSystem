from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    username: str = Field(..., alias="username")
    email: EmailStr = Field(..., alias="email")
    fullName: Optional[str] = Field(None, alias="fullName")
    age: Optional[int] = Field(None, alias="age")
    gender: Optional[str] = Field(None, alias="gender")  # male / female / other
    favorite_books: List[str] = Field(default_factory=list, alias="favorite_books")
    wishlist: List[str] = Field(default_factory=list, alias="wishlist")
    recommendations: List[str] = Field(default_factory=list, alias="recommendations")
    admin_status: bool = Field(False, alias="admin_status")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class UserCreate(BaseModel):
    username: str = Field(..., alias="username")
    email: EmailStr = Field(..., alias="email")
    fullName: Optional[str] = Field(None, alias="fullName")
    age: Optional[int] = Field(None, alias="age")
    gender: Optional[str] = Field(None, alias="gender")
    password: str = Field(..., alias="password")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }


class UserLogin(BaseModel):
    username: str = Field(..., alias="username")
    password: str = Field(..., alias="password")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class UserUpdate(BaseModel):
    fullName: Optional[str] = Field(None, alias="fullName")
    age: Optional[int] = Field(None, alias="age")
    gender: Optional[str] = Field(None, alias="gender")
    favorite_books: Optional[List[str]] = Field(None, alias="favorite_books")
    wishlist: Optional[List[str]] = Field(None, alias="wishlist")
    recommendations: Optional[List[str]] = Field(None, alias="recommendations")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class UserResponse(UserBase):
    id: Optional[str] = Field(None, alias="_id")
    createdAt: Optional[datetime] = Field(None, alias="createdAt")
    updatedAt: Optional[datetime] = Field(None, alias="updatedAt")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )
class UserInDB(UserResponse):
    password_hash: str
