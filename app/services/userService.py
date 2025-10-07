from datetime import datetime, timedelta
from bson import ObjectId
import jwt

from app.repository.userRepo import UserRepository
from app.models.user import UserCreate, UserUpdate, UserResponse
from app.utils.security import pwd_context  # bcrypt context
from app.config.settings import settings

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES


class UserService:
    def __init__(self, mongoClient):
        self.userRepository = UserRepository(mongoClient)

    # =========================
    # Utility
    # =========================
    def _convert_to_ObjectID(self, id: str) -> ObjectId:
        try:
            return ObjectId(id)
        except Exception:
            raise ValueError("Invalid id format")

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta = None):
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # =========================
    # Business Logic
    # =========================
    async def register_user(self, user_data: UserCreate) -> UserResponse:
        # Kiểm tra email & username đã tồn tại
        if await self.userRepository.find_user_by_email(user_data.email):
            raise ValueError("Email already registered")
        if await self.userRepository.find_user_by_username(user_data.username):
            raise ValueError("Username already exists")

        now = datetime.utcnow()
        hashed_pw = self.hash_password(user_data.password)

        # Chuẩn bị data insert
        user_dict = user_data.dict(by_alias=True, exclude={"password"})
        user_dict.update({
            "password_hash": hashed_pw,
            "admin_status": False,
            "createdAt": now,
            "updatedAt": now,
        })

        return await self.userRepository.insert_user(user_dict)

    async def login_user(self, username: str, password: str) -> dict:
        user = await self.userRepository.find_user_by_username(username, include_password=True)
        if not user or not self.verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials")

        token = self.create_access_token(
            {"sub": str(user.id), "username": user.username, "admin": user.admin_status}
        )
        return {"access_token": token, "token_type": "bearer"}


        token = self.create_access_token(
            {"sub": str(user.id), "username": user.username, "admin": user.admin_status}
        )
        return {"access_token": token, "token_type": "bearer"}

    async def get_user_by_id(self, user_id: str) -> UserResponse:
        return await self.userRepository.find_user_by_id(user_id)

    async def update_user(self, user_id: str, update_data: UserUpdate) -> UserResponse:
        data = update_data.dict(exclude_unset=True, by_alias=True)
        if not data:
            raise ValueError("No data provided for update")
        return await self.userRepository.update_user(user_id, data)
    
    async def logout_user(self) -> dict:
        return {"message": "User logged out. Please remove the token on client side."}
