import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { getFavoriteBooks, removeFavoriteBook } from "../../api/favorites";
import BookCard from "../../components/BookCard";

const FavoriteBooksPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteBooks();
      setFavorites(data);
    } catch (err) {
      message.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (book, added) => {
    // Nếu bỏ yêu thích trong trang này thì xóa khỏi danh sách
    if (!added) {
      setFavorites((prev) => prev.filter((b) => (b._id || b.ISBN) !== (book._id || book.ISBN)));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );

  return (
    <div className="p-4 bg-white min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Sách yêu thích của bạn</h2>

      {favorites.length === 0 ? (
        <p>Bạn chưa có sách yêu thích nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((book) => (
            <BookCard
              key={book._id || book.ISBN}
              book={book}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteBooksPage;
