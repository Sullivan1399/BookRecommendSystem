import React, { useEffect, useState } from "react";
import { Button, Divider, Spin } from "antd";
import BookCard from "../../components/BookCard";
import { useLocation } from "react-router-dom";
import { searchBooks } from "../../api/books"; // ✅ import hàm bạn có sẵn

const BookDetails = () => {
  const location = useLocation();
  const bookDetail = location.state?.book;
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!bookDetail) {
    return <p className="p-8 text-red-500">Không tìm thấy dữ liệu sách.</p>;
  }

  // ✅ Khi vào trang → gọi API tìm sách tương tự
  useEffect(() => {
    const fetchSimilarBooks = async () => {
      if (!bookDetail["Description"]) return;
      setLoading(true);
      try {
        const result = await searchBooks(bookDetail["Description"], 6);
        setSuggestedBooks(result);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách tương tự:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilarBooks();
  }, [bookDetail]);

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Thông tin chi tiết */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div className="flex justify-center">
          <img
            src={bookDetail["Image-URL-L"]}
            alt={bookDetail["Book-Title"]}
            className="rounded-xl shadow-md object-cover h-[450px]"
          />
        </div>

        {/* Thông tin sách */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-black mb-4">
              {bookDetail["Book-Title"]}
            </h1>
            <p className="text-gray-700 text-lg mb-2">
              <span className="font-medium">Tác giả:</span>{" "}
              {bookDetail["Book-Author"]}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Năm XB:</span>{" "}
              {bookDetail["Year-Of-Publication"]}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">NXB:</span>{" "}
              {bookDetail["Publisher"]}
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-medium">ISBN:</span> {bookDetail.ISBN}
            </p>
            <p className="text-gray-700 mb-1">
              <span className="font-medium">Mô tả:</span>{" "}
              {bookDetail["Description"] || "Không có mô tả"}
            </p>
          </div>

          <Button
            type="primary"
            size="large"
            className="bg-black text-white px-8 py-5 rounded-lg hover:bg-gray-800 transition"
          >
            Đọc ngay
          </Button>
        </div>
      </div>

      {/* Gợi ý thêm */}
      <div className="max-w-6xl mx-auto mt-12">
        <Divider orientation="left" className="text-lg font-semibold text-black">
          Gợi ý thêm
        </Divider>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" tip="Đang tìm sách tương tự..." />
          </div>
        ) : suggestedBooks.length === 0 ? (
          <p className="text-gray-500 italic">
            Không tìm thấy sách tương tự.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedBooks.map((book) => (
              <BookCard key={book.ISBN || book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
