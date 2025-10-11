from fastapi import HTTPException
from bson import ObjectId

from app.repository.favoriteBookRepo import FavoriteBookRepository
from app.repository.favoriteGenreRepo import FavoriteGenreRepository
from app.repository.bookRepo import BookRepository
from app.repository.bookEmbeddingRepo import BookEmbeddingRepository
from app.utils.embedding import generate_embedding
from app.models.book import BookResponse


class RecommendService:
    def __init__(self, mongoClient):
        self.favoriteBookRepo = FavoriteBookRepository(mongoClient)
        self.favoriteGenreRepo = FavoriteGenreRepository(mongoClient)
        self.bookRepo = BookRepository(mongoClient)
        self.bookEmbeddingRepo = BookEmbeddingRepository(mongoClient)

    async def recommend_books_for_user(self, user_id: str, top_k: int = 5):
        """
        Gợi ý sách dựa trên favorite books và favorite genres của người dùng.
        """

        # --- 1️⃣ Lấy danh sách sách yêu thích ---
        favorites = await self.favoriteBookRepo.get_by_user(user_id)
        book_ids = [ObjectId(fav.book_id) for fav in favorites if fav.book_id]

        favorite_books = []
        if book_ids:
            cursor = self.bookRepo.collection.find({"_id": {"$in": book_ids}})
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                favorite_books.append(doc)

        # --- 2️⃣ Lấy danh sách thể loại yêu thích ---
        favorite_genres = await self.favoriteGenreRepo.get_by_user(user_id)
        favorite_genres_text = ", ".join([g.genre for g in favorite_genres]) if favorite_genres else ""

        # --- 3️⃣ Ghép text đầu vào vector search ---
        query_parts = []
        for b in favorite_books:
            query_parts.append(f"{b.get('Book-Title','')} {b.get('Book-Author','')} {b.get('Category','')} {b.get('Description','')}")
        query_text = " ".join(query_parts) + " " + favorite_genres_text

        if not query_text.strip():
            raise HTTPException(status_code=400, detail="User has no favorite books or genres.")

        # --- 4️⃣ Sinh embedding và tìm sách tương tự ---
        query_embedding = generate_embedding(query_text)
        results = await self.bookEmbeddingRepo.vector_search(query_embedding, k=top_k)

        # --- 5️⃣ Chuyển kết quả sang BookResponse và loại bỏ sách đã yêu thích ---
        favorite_ids = {b["_id"] for b in favorite_books}
        recommendations = [BookResponse(**r) for r in results if r.get("id") not in favorite_ids]

        return recommendations
