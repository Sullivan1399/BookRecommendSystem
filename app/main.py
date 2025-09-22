import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient

from app.config.settings import settings
from app.config.database import MongoClientSingleton
from app.services import bookService, userService
from app.routers import bookRoute, userRoute

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

app.include_router(bookRoute.router, prefix="/books", tags=["Books"])
app.include_router(userRoute.router, prefix="/users", tags=["Users"])
@app.get("/")
async def root():
    return {
        "message": "Hello World!"
    }

if __name__ == "__main":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True, workers=1)