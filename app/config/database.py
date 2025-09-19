from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.exceptions import HTTPException
from .settings import settings

class MongoClientSingleton:
    _instance = None
    _client: AsyncIOMotorClient | None = None

    def __new__(cls):
        if cls._instance == None:
            cls._instance = super(MongoClientSingleton, cls).__new__(cls)
            cls._client = cls._instance.initialize_client()
            print("Initialized MongoDB Atlas Client.")
        return cls._instance
    
    def initialize_client(self) -> AsyncIOMotorClient:
        client = AsyncIOMotorClient(settings.MONGODB_URI)
        # Validate Database and Collection - But Motor doesn't support create_collections()
        # self._ensure_collection_exists(client)
        return client
    
    # def _ensure_collection_exists (self, client: AsyncIOMotorClient):

    def get_client(self) -> AsyncIOMotorClient:
        if self._client is None:
            raise RuntimeError("MongoDB Atlas client has not been initialized.")
        return self._client
    
    async def close_client(self):
        self._client.close()
        self._client = None
        print("MongoDB Atlas closed.")
    
def get_mongodb_client_singleton() -> AsyncIOMotorClient:
    return MongoClientSingleton().get_client()