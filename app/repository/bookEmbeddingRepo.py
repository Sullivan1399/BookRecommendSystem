from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

class BookEmbeddingRepository:
    def __init__(self, mongoClient: AsyncIOMotorClient):
        self.mongoClient = mongoClient
        self.database = self.mongoClient[settings.DATABASE_NAME]
        self.collection = self.database[settings.BOOK_EMBEDDING_COLLECTION_NAME]

    async def insert(self, ISBN: str, embedding: list):
        return await self.collection.insert_one({"ISBN": ISBN, "Embedding": embedding})

    async def update(self, ISBN: str, embedding: list):
        return await self.collection.update_one(
            {"ISBN": ISBN}, {"$set": {"Embedding": embedding}}
        )

    async def delete(self, ISBN: str):
        return await self.collection.delete_one({"ISBN": ISBN})

    async def vector_search(self, query_embedding: list, k: int = 5):
        """Vector search trong collection BookEmbedding, join sang Book để lấy metadata"""
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "book_embedding_index",
                    "path": "Embedding",
                    "queryVector": query_embedding,
                    "numCandidates": 100,
                    "limit": k
                }
            },
            {
                "$lookup": {
                    "from": "Book",
                    "localField": "ISBN",
                    "foreignField": "ISBN",
                    "as": "book_info"
                }
            },
            {"$unwind": "$book_info"},
            {
                "$project": {
                    "_id": "$book_info._id",  # ✅ Lấy _id thật từ Book
                    "ISBN": 1,
                    "score": {"$meta": "vectorSearchScore"},
                    "Book-Title": "$book_info.Book-Title",
                    "Book-Author": "$book_info.Book-Author",
                    "Year-Of-Publication": "$book_info.Year-Of-Publication",
                    "Publisher": "$book_info.Publisher",
                    "Category": "$book_info.Category",
                    "Description": "$book_info.Description",
                    "Image-URL-S": "$book_info.Image-URL-S",
                    "Image-URL-M": "$book_info.Image-URL-M",
                    "Image-URL-L": "$book_info.Image-URL-L"
                }
            }
        ]
        cursor = self.collection.aggregate(pipeline)
        results = [doc async for doc in cursor]

        # ✅ Chuyển ObjectId thành string để serialize được
        for r in results:
            if "_id" in r:
                r["_id"] = str(r["_id"])
        return results
