import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.config.database import MongoClientSingleton
from app.services import bookService, userService, recommendService
from app.routers import bookRoute, userRoute, favoriteBookRouter, favoriteGenreRouter, recommendRouter, chatbotRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    mongoClient = MongoClientSingleton()
    print("Model loading...")
    svc = recommendService.get_recommender()
    svc.load_all()
    print("Application startup complete. Ready to serve requests.")

    yield

    await mongoClient.close_client()
    
    print("Shutting down application...")
    

app = FastAPI(
    title="Books Recommendation Application",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",   # Frontend (Vite/React)
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(bookRoute.router, prefix="/books", tags=["Books"])
app.include_router(userRoute.router, prefix="/users", tags=["Users"])
app.include_router(recommendRouter.router, prefix="/recommend", tags=["Recommends"])
app.include_router(chatbotRouter.router, prefix="/chat", tags=["Chatbot"])
app.include_router(favoriteBookRouter.router)   
app.include_router(favoriteGenreRouter.router)

@app.get("/")
async def root():
    return {
        "message": "Hello World!"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True, workers=1)