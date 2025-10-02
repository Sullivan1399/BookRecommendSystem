import React from "react";
import { Card } from "antd";

const { Meta } = Card;

const FavoriteBooksPage = () => {
  // Mock data sách yêu thích
  const favoriteBooks = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    },
    {
      id: 2,
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt, David Thomas",
      cover:
        "https://images-na.ssl-images-amazon.com/images/I/518FqJvR9aL._SX377_BO1,204,203,200_.jpg",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover:
        "https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-6">Sách Yêu Thích</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {favoriteBooks.map((book) => (
          <Card
            key={book.id}
            hoverable
            cover={
              <img
                alt={book.title}
                src={book.cover}
                className="h-64 object-cover"
              />
            }
            className="shadow-md rounded-lg"
          >
            <Meta
              title={<span className="font-semibold">{book.title}</span>}
              description={<span className="text-gray-600">{book.author}</span>}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoriteBooksPage;
