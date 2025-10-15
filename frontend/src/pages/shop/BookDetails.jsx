import React, { useEffect, useState } from "react";
import { Button, Divider, Spin, Rate, Input, List, message, Modal } from "antd"; // 🟢 Thêm Modal ở đây
import BookCard from "../../components/BookCard";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBooks } from "../../api/books";
import {
  getRatingsForBook,
  getAverageRating,
  submitRating,
} from "../../api/ratings";

const { TextArea } = Input;

const BookDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookDetail = location.state?.book;

  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ Quản lý rating
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ⚠️ Modal báo lỗi
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    content: "",
  });

  if (!bookDetail) {
    return <p className="p-8 text-red-500">Không tìm thấy dữ liệu sách.</p>;
  }

  // ✅ Gợi ý sách tương tự
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

  // ✅ Lấy danh sách đánh giá và điểm trung bình
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const [res1, res2] = await Promise.all([
          getRatingsForBook(bookDetail.ISBN),
          getAverageRating(bookDetail.ISBN),
        ]);
        setRatings(res1);
        setAverage(res2.average_rating);
      } catch (err) {
        console.error("Lỗi khi lấy đánh giá:", err);
        setErrorModal({
          visible: true,
          title: "Không thể tải đánh giá",
          content: "Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.",
        });
      }
    };
    fetchRatings();
  }, [bookDetail.ISBN]);

  // ✅ Gửi đánh giá mới (dùng fetch)
  const handleSubmitRating = async () => {
    if (!myRating) return message.warning("Vui lòng chọn số sao!");
    const token = localStorage.getItem("access_token");
    if (!token) {
      setErrorModal({
        visible: true,
        title: "Yêu cầu đăng nhập",
        content: "Bạn cần đăng nhập để gửi đánh giá.",
      });
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ISBN: bookDetail.ISBN,
        rating: myRating,
        text: myComment,
      };

      const response = await submitRating(token, payload);
      console.log("✅ Đánh giá đã gửi:", response);
      message.success("Đã gửi đánh giá!");

      // Làm mới lại danh sách
      const [newRatings, newAvg] = await Promise.all([
        getRatingsForBook(bookDetail.ISBN),
        getAverageRating(bookDetail.ISBN),
      ]);
      setRatings(newRatings);
      setAverage(newAvg.average_rating);

      // Reset input
      setMyRating(0);
      setMyComment("");
    } catch (err) {
      console.error("❌ Lỗi gửi rating:", err);
      let msg = "Không thể gửi đánh giá. Vui lòng thử lại.";

      if (err.message.includes("401")) {
        msg = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        localStorage.removeItem("access_token");
        navigate("/login");
      } else if (err.message.includes("NetworkError")) {
        msg = "Không thể kết nối tới máy chủ. Kiểm tra mạng của bạn.";
      }

      // 🧠 Hiển thị modal lỗi
      setErrorModal({
        visible: true,
        title: "Lỗi khi gửi đánh giá",
        content: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-8">
      {/* =================== PHẦN THÔNG TIN SÁCH =================== */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <div className="flex justify-center">
          <img
            src={bookDetail["Image-URL-L"]}
            alt={bookDetail["Book-Title"]}
            className="rounded-xl shadow-md object-cover h-[450px]"
          />
        </div>

        {/* Thông tin */}
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

          {/* ⭐ Điểm trung bình */}
          <div>
            <p className="text-lg font-semibold text-yellow-600">
              ⭐ Điểm trung bình: {average?.toFixed(1) || 0}/10
            </p>
            <p className="text-gray-500 text-sm">
              ({ratings.length} lượt đánh giá)
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

      {/* =================== PHẦN ĐÁNH GIÁ =================== */}
      <div className="max-w-6xl mx-auto mt-12">
        <Divider orientation="left" className="text-lg font-semibold text-black">
          Đánh giá của bạn
        </Divider>

        {/* Input rating */}
        <div className="flex flex-col gap-4 mb-8">
          <Rate
            count={10}
            value={myRating}
            onChange={setMyRating}
            className="text-yellow-500 text-2xl"
          />
          <TextArea
            rows={3}
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Viết cảm nhận của bạn..."
          />
          <Button
            type="primary"
            loading={submitting}
            onClick={handleSubmitRating}
          >
            Gửi đánh giá
          </Button>
        </div>

        {/* Danh sách các đánh giá */}
        <Divider orientation="left" className="text-lg font-semibold text-black">
          Tất cả đánh giá
        </Divider>

        {ratings.length === 0 ? (
          <p className="text-gray-500 italic">Chưa có đánh giá nào.</p>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={ratings}
            renderItem={(item) => (
              <List.Item>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-black">
                    {item.FullName || item.Username || "Người dùng ẩn danh"}
                  </span>
                  <span className="text-yellow-500 font-semibold">
                    {item["Book-Rating"]}/10
                  </span>
                </div>
                <p className="text-gray-700">
                  {item.Text || "Không có bình luận"}
                </p>
                <Divider />
              </List.Item>
            )}
          />
        )}
      </div>

      {/* =================== GỢI Ý SÁCH =================== */}
      <div className="max-w-6xl mx-auto mt-12">
        <Divider orientation="left" className="text-lg font-semibold text-black">
          Gợi ý thêm
        </Divider>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" tip="Đang tìm sách tương tự..." />
          </div>
        ) : suggestedBooks.length === 0 ? (
          <p className="text-gray-500 italic">Không tìm thấy sách tương tự.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedBooks.map((book) => (
              <BookCard key={book.ISBN || book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* ⚠️ Modal thông báo lỗi */}
      <Modal
        open={errorModal.visible}
        title={errorModal.title}
        onCancel={() => setErrorModal({ ...errorModal, visible: false })}
        onOk={() => setErrorModal({ ...errorModal, visible: false })}
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>{errorModal.content}</p>
      </Modal>
    </div>
  );
};

export default BookDetails;
