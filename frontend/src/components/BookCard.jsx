import React, { useState } from "react";
import { Card, Dropdown, Menu, message } from "antd";
import {
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
} from "@ant-design/icons";
import { addFavoriteBook, removeFavoriteBook } from "../api/favorites";

const { Meta } = Card;

const BookCard = ({
  book,
  isFavorite: defaultFavorite = false,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(defaultFavorite);
  const [favoriteType, setFavoriteType] = useState("heart"); // "heart" hoặc "bookmark"

  // Hàm toggle yêu thích
  const toggleFavorite = async (e) => {
    e.stopPropagation();
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
      message.error(err.message || "Lỗi thao tác yêu thích");
    }
  };

  // Menu đổi biểu tượng
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

  // Icon hiển thị
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
        <BookFilled className="text-white text-xl" />
      ) : (
        <BookOutlined className="text-blue-500 text-xl" />
      );
    }
  };

  // Style cho nút yêu thích
  const getFavoriteButtonStyle = () => {
    if (favoriteType === "heart") {
      return isFavorite
        ? "bg-red-500 border-black"
        : "bg-white text-red-500 hover:bg-red-400 border-black";
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
      {/* Nút yêu thích */}
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div
          onClick={toggleFavorite}
          className={`!absolute top-3 right-3 z-10 rounded-full shadow-md p-2 cursor-pointer transition-none hover:scale-110 ${getFavoriteButtonStyle()}`}
        >
          {getIcon()}
        </div>
      </Dropdown>

      {/* Thẻ sách */}
      <Card
        hoverable
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
