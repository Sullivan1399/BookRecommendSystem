import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.config.database import MongoClientSingleton
from app.services import bookService, userService
from app.routers import bookRoute, userRoute, favoriteBookRouter, favoriteGenreRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    mongoClient = MongoClientSingleton()
    print("Application startup complete. Ready to serve requests.")

    yield

    await mongoClient.close_client()
    
    print("Shutting down application...")


app = FastAPI(
    title="Books Recommendation Application",
    lifespan=lifespan
)
# ✅ Cấu hình CORS
origins = [
    "http://localhost:5173",   # Frontend (Vite/React)
    "http://127.0.0.1:5173",   # Trường hợp bạn truy cập bằng 127.0.0.1
    # "*"  # Nếu muốn cho phép tất cả origin (không khuyến khích cho production)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # danh sách origin được phép
    allow_credentials=True,
    allow_methods=["*"],              # cho phép tất cả phương thức (GET, POST, PUT, DELETE...)
    allow_headers=["*"],              # cho phép tất cả header (Content-Type, Authorization...)
)
app.include_router(bookRoute.router, prefix="/books", tags=["Books"])
app.include_router(userRoute.router, prefix="/users", tags=["Users"])
app.include_router(favoriteBookRouter.router)   
app.include_router(favoriteGenreRouter.router)
@app.get("/")
async def root():
    return {
        "message": "Hello World!"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True, workers=1)