import React, { useState, useEffect } from "react";
import { Card, Dropdown, Menu, message } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
} from "@ant-design/icons";
import { addFavoriteBook, removeFavoriteBook } from "../api/favorites";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

const BookCard = ({
  book,
  isFavorite: defaultFavorite = false,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(defaultFavorite);
  const [favoriteType, setFavoriteType] = useState("heart"); // "heart" hoặc "bookmark"
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ để xác định login
  const navigate = useNavigate();

  // ✅ Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Toggle yêu thích (chỉ khi login)
  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) return; // ❌ chưa đăng nhập → không làm gì

    try {
      if (!isFavorite) {
        await addFavoriteBook(book._id || book.ISBN);
        setIsFavorite(true);
        message.success("Đã thêm vào yêu thích");
        onToggleFavorite?.(book, true);
      } else {
        await removeFavoriteBook(book._id || book.ISBN);
        setIsFavorite(false);
        message.info("Đã bỏ khỏi yêu thích");
        onToggleFavorite?.(book, false);
      }
    } catch (err) {
      console.error("❌ Lỗi thao tác yêu thích:", err);
      message.error(err.message || "Lỗi thao tác yêu thích");
    }
  };

  // ✅ Chuyển sang trang chi tiết khi click
  const handleCardClick = () => {
    navigate("/books/details", { state: { book } });
  };

  // ✅ Menu đổi biểu tượng
  const handleChangeType = ({ key }) => {
    setFavoriteType(key);
  };

  const menu = (
    <Menu
      onClick={handleChangeType}
      items={[
        { key: "heart", label: "Trái tim ❤️" },
        { key: "bookmark", label: "Bookmark 📑" },
      ]}
    />
  );

  // ✅ Icon hiển thị
  const getIcon = () => {
    if (favoriteType === "heart") {
      return isFavorite ? (
        <HeartFilled className="text-red-500 text-xl" />
      ) : (
        <HeartOutlined className="text-red-500 text-xl" />
      );
    }
    if (favoriteType === "bookmark") {
      return isFavorite ? (
        <BookFilled className="text-blue-600 text-xl" />
      ) : (
        <BookOutlined className="text-blue-500 text-xl" />
      );
    }
  };

  // ✅ Style cho nút yêu thích
  const getFavoriteButtonStyle = () => {
    if (favoriteType === "heart") {
      return isFavorite
        ? "bg-red-500 border border-red-600"
        : "bg-white text-red-500 hover:bg-red-50 border border-gray-300";
    }
    if (favoriteType === "bookmark") {
      return isFavorite
        ? "bg-blue-500 hover:bg-blue-600 border-blue-500"
        : "bg-white border-2 border-blue-500 hover:bg-blue-50";
    }
    return "bg-white";
  };

  return (
    <div className="relative h-full">
      {/* ❤️ Nút yêu thích — chỉ hiển thị nếu đã login */}
      {isLoggedIn && (
        <Dropdown overlay={menu} trigger={["contextMenu"]}>
          <div
            onClick={toggleFavorite}
            className={`!absolute top-3 right-3 z-10 rounded-full shadow-md p-2 cursor-pointer transition-all hover:scale-110 ${getFavoriteButtonStyle()}`}
          >
            {getIcon()}
          </div>
        </Dropdown>
      )}

      {/* 📘 Thẻ sách */}
      <Card
        hoverable
        onClick={handleCardClick}
        className="shadow-md rounded-lg border-gray-200 h-full flex flex-col"
        cover={
          <div className="w-full aspect-[6/3] overflow-hidden rounded-t-lg">
            <img
              alt={book["Book-Title"]}
              src={book["Image-URL-L"]}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/200x260?text=No+Image";
              }}
            />
          </div>
        }
      >
        <Meta
          title={
            <span className="font-semibold text-base sm:text-lg line-clamp-2">
              {book["Book-Title"]}
            </span>
          }
          description={
            <div className="text-gray-700 text-sm sm:text-base mt-2">
              <p>Tác giả: {book["Book-Author"]}</p>
              <p>Năm XB: {book["Year-Of-Publication"]}</p>
              <p>NXB: {book.Publisher}</p>
              {book.Category && <p>Thể loại: {book.Category}</p>}
              <p className="text-xs text-gray-400 mt-1">ISBN: {book.ISBN}</p>
            </div>
          }
        />
      </Card>
    </div>
  );
};

export default BookCard;
