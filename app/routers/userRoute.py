from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt

from app.utils.dependencies import get_user_service
from app.services.userService import UserService
from app.models.user import UserCreate, UserLogin, UserUpdate, UserResponse
from app.config.settings import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


# =========================
# USER CRUD & AUTH
# =========================
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, userService: UserService = Depends(get_user_service)):
    try:
        created_user = await userService.register_user(user)
        return created_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(),
                userService: UserService = Depends(get_user_service)):
    result = await userService.login_user(form_data.username, form_data.password)
    return result


@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Depends(oauth2_scheme), userService: UserService = Depends(get_user_service)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await userService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, update_data: UserUpdate,
                      token: str = Depends(oauth2_scheme),
                      userService: UserService = Depends(get_user_service)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("sub") != user_id and not payload.get("admin"):
            raise HTTPException(status_code=403, detail="Not authorized")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    updated_user = await userService.update_user(user_id, update_data)
    if not updated_user:
        raise HTTPException(status_code=400, detail="Update failed")
    return updated_user

@router.post("/logout")
async def logout(userService: UserService = Depends(get_user_service),
                 token: str = Depends(oauth2_scheme)):
    """
    Logout user: Client should delete the JWT token locally (in storage/cookie).
    """
    return await userService.logout_user()