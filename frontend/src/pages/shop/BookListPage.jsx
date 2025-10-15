import React, { useState, useEffect } from "react";
import { Spin, Pagination, message } from "antd";
import { useNavigate } from "react-router-dom";
import { getBooksPaginated } from "../../api/books";
import { getFavoriteBooks } from "../../api/favorites";
import BookCard from "../../components/BookCard";

const BooksListPage = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

  // ✅ Hàm fetch dữ liệu chính
  const fetchData = async (page, limit) => {
    setLoading(true);
    try {
      // 1️⃣ Lấy danh sách sách (public)
      const bookData = await getBooksPaginated(page, limit);
      setBooks(bookData.items || bookData);
      setTotal(bookData.total || bookData.length || 0);

      // 2️⃣ Nếu có token → lấy danh sách yêu thích
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const favData = await getFavoriteBooks();
          setFavoriteIds(favData.map((b) => b._id || b.ISBN));
        } catch (favErr) {
          console.warn("⚠️ Không thể tải danh sách yêu thích:", favErr);
          setFavoriteIds([]);
        }
      } else {
        setFavoriteIds([]); // người chưa đăng nhập
      }
    } catch (err) {
      console.error("❌ Lỗi tải danh sách sách:", err);
      message.error("Không thể tải danh sách sách.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Khi click một sách → chuyển sang trang chi tiết
  const handleDetailBook = (book) => {
    navigate("/books/details", { state: { book } });
  };

  // ✅ Toggle yêu thích
  const handleToggleFavorite = (book, added) => {
    const id = book._id || book.ISBN;
    setFavoriteIds((prev) =>
      added ? [...prev, id] : prev.filter((fid) => fid !== id)
    );
  };

  // ✅ Loading UI
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải sách..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-white px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Có <span className="font-semibold">{total}</span> sách
        </p>
      </div>

      {/* ✅ Lưới sách */}
      {books.length === 0 ? (
        <div className="text-center text-gray-500 italic py-10">
          Không có sách để hiển thị.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map((book) => {
            const id = book._id || book.ISBN;
            return (
              <div
                key={id}
                onClick={() => handleDetailBook(book)}
                className="cursor-pointer"
              >
                <BookCard
                  book={book}
                  isFavorite={favoriteIds.includes(id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={limit}
          total={total}
          onChange={(p, l) => {
            setPage(p);
            setLimit(l);
          }}
          showSizeChanger
        />
      </div>
    </div>
  );
};

export default BooksListPage;
