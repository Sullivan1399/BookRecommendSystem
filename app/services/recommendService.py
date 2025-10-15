import os
import joblib
import pickle
from scipy.sparse import load_npz
from typing import List, Tuple, Dict, Optional
import numpy as np
from concurrent.futures import ThreadPoolExecutor

PERSIST_DIR = os.getenv("PERSIST_DIR", "app/recommendSystem")

class AIRecommenderService:
    _instance = None

    def __init__(self):
        self.topk_neighbors: Dict[str, List[Tuple[str, float]]] = {}
        self.indexMap = {}
        self.reverseIndexMap = {}
        self.dictVectorizer = None

        self.nn_model = None
        self.item_user_df = None

        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.popular_meta = None

        # threadpool for heavy compute
        self.executor = ThreadPoolExecutor(max_workers=2)

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = AIRecommenderService()
        return cls._instance

    def _path(self, fname: str) -> str:
        return os.path.join(PERSIST_DIR, fname)

    def load_all(self):
        ### startup task
        # collaborative topk
        try:
            self.topk_neighbors = joblib.load(self._path("item_topk_neighbors.pkl"))
            self.indexMap = joblib.load(self._path("indexMap.pkl"))
            self.reverseIndexMap = joblib.load(self._path("reverseIndexMap.pkl"))
            self.dictVectorizer = joblib.load(self._path("dict_vectorizer.pkl"))
        except Exception as e:
            print("Warning: can't load topk/collab artifacts:", e)

        # KNN/NearestNeighbors
        try:
            self.nn_model = joblib.load(self._path("nn_model.joblib"))
            self.item_user_df = joblib.load(self._path("item_user.pkl"))
        except Exception as e:
            print("Warning: can't load nn model artifacts:", e)

        # content TF-IDF
        try:
            self.tfidf_vectorizer = joblib.load(self._path("tfidf_vectorizer.pkl"))
            self.tfidf_matrix = load_npz(self._path("tfidf_matrix.npz"))
            self.popular_meta = joblib.load(self._path("popular_book_meta.pkl"))
        except Exception as e:
            print("Warning: can't load tfidf artifacts:", e)

        print("RecommenderService: finished loading persisted artifacts")

    def recommend_by_isbn_topk(self, isbn: str, k: int = 10) -> List[str]:
        # collaborative topk
        if not self.topk_neighbors:
            return []
        return [nb for nb, score in self.topk_neighbors.get(isbn, [])[:k]]

    def recommend_by_isbn_nn(self, isbn: str, k: int = 10) -> List[str]:
        # KNN/NearestNeighbors
        if self.nn_model is None or self.item_user_df is None:
            return []
        if isbn not in self.item_user_df.index:
            return []
        dist, indices = self.nn_model.kneighbors(self.item_user_df.loc[isbn].values.reshape(1, -1), n_neighbors=k+1)
        recs = []
        for i in indices.flatten():
            cand = self.item_user_df.index[i]
            if cand != isbn:
                recs.append(cand)
            if len(recs) >= k:
                break
        return recs

    def recommend_content_by_isbn(self, isbn: str, k: int = 10) -> List[str]:
        # content TF-IDF
        if self.tfidf_matrix is None or self.popular_meta is None:
            return []
        # find row index in popular_meta
        rows = self.popular_meta.index[self.popular_meta['ISBN'] == isbn].tolist()
        if not rows:
            return []
        idx = rows[0]
        # compute cosine similarity between row idx and all
        row_vec = self.tfidf_matrix[idx]
        sims = (self.tfidf_matrix @ row_vec.T).toarray().flatten()  # faster than dense cosine for sparse
        # sort descending, skip self
        sorted_idx = np.argsort(sims)[::-1]
        recs = []
        for i in sorted_idx:
            if i == idx:
                continue
            recs.append(self.popular_meta.loc[i, 'ISBN'])
            if len(recs) >= k:
                break
        return recs

    def recommend_hybrid(self, isbn: str, k: int = 10) -> List[str]:
        # Hybrid - Combine collaborative topk and content with simple scoring.
        collab = self.recommend_by_isbn_topk(isbn, k=50)
        content = self.recommend_content_by_isbn(isbn, k=50)
        # weighting scheme: rank-based percentile
        z = []
        K = k
        step = 1.0 / K
        weights = {}
        for idx, item in enumerate(collab):
            weights[item] = weights.get(item, 0) + (1 - step * idx)
        for idx, item in enumerate(content):
            weights[item] = weights.get(item, 0) + (1 - step * idx)
        # sort
        sorted_items = sorted(weights.items(), key=lambda x: x[1], reverse=True)
        result = [isbn for isbn, score in sorted_items if isbn != isbn][:k]  # avoid self; but here isbn variable shadows -> fix
        # correct avoid-self:
        out = []
        for isbn_cand, score in sorted_items:
            if isbn_cand == isbn:
                continue
            out.append(isbn_cand)
            if len(out) >= k:
                break
        return out

# export instance factory
def get_recommender():
    svc = AIRecommenderService.get_instance()
    return svc


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

        #  Lấy danh sách sách yêu thích ---
        favorites = await self.favoriteBookRepo.get_by_user(user_id)
        book_ids = [ObjectId(fav.book_id) for fav in favorites if fav.book_id]

        favorite_books = []
        if book_ids:
            cursor = self.bookRepo.collection.find({"_id": {"$in": book_ids}})
            async for doc in cursor:
                doc["_id"] = str(doc["_id"])
                favorite_books.append(doc)

        #  Lấy danh sách thể loại yêu thích ---
        favorite_genres = await self.favoriteGenreRepo.get_by_user(user_id)
        favorite_genres_text = ", ".join([g.genre for g in favorite_genres]) if favorite_genres else ""

        #  Ghép text đầu vào vector search ---
        query_parts = []
        for b in favorite_books:
            query_parts.append(f"{b.get('Book-Title','')} {b.get('Book-Author','')} {b.get('Category','')} {b.get('Description','')}")
        query_text = " ".join(query_parts) + " " + favorite_genres_text

        if not query_text.strip():
            raise HTTPException(status_code=400, detail="User has no favorite books or genres.")

        #  Sinh embedding và tìm sách tương tự ---
        query_embedding = generate_embedding(query_text)
        results = await self.bookEmbeddingRepo.vector_search(query_embedding, k=top_k)

        # Chuyển kết quả sang BookResponse và loại bỏ sách đã yêu thích ---
        favorite_ids = {b["_id"] for b in favorite_books}
        recommendations = [BookResponse(**r) for r in results if r.get("id") not in favorite_ids]

        return recommendations
