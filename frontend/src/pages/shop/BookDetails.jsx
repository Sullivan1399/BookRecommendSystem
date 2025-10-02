import React from "react";
import { Button, Divider } from "antd";
import BookCard from "../../components/BookCard";
import { useLocation } from "react-router-dom";

const suggestedBooks = [
  {
    ISBN: "0002005018",
    "Book-Title": "Clara Callan",
    "Book-Author": "Richard Bruce Wright",
    "Year-Of-Publication": "2001",
    Publisher: "HarperFlamingo Canada",
    "Image-URL-L":
      "http://images.amazon.com/images/P/0002005018.01.LZZZZZZZ.jpg",
  },
  {
    ISBN: "0002005166",
    "Book-Title": "The Lovely Bones",
    "Book-Author": "Alice Sebold",
    "Year-Of-Publication": "2002",
    Publisher: "Little Brown & Company",
    "Image-URL-L":
      "http://images.amazon.com/images/P/0002005166.01.LZZZZZZZ.jpg",
  },
  {
    ISBN: "0002005568",
    "Book-Title": "Life of Pi",
    "Book-Author": "Yann Martel",
    "Year-Of-Publication": "2001",
    Publisher: "Knopf Canada",
    "Image-URL-L":
      "http://images.amazon.com/images/P/0002005568.01.LZZZZZZZ.jpg",
  },
];

const BookDetails = () => {
  const location = useLocation();
  const bookDetail = location.state?.book;
  if (!bookDetail) {
    return <p className="p-8 text-red-500">Không tìm thấy dữ liệu sách.</p>;
  }
  return (
    <div className="bg-white min-h-screen p-8">
      {/* Main content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={bookDetail["Image-URL-L"]}
            alt={bookDetail["Book-Title"]}
            className="rounded-xl shadow-md object-cover h-[450px]"
          />
        </div>

        {/* Book Info */}
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
          </div>

          <Button
            type="primary"
            size="large"
            className="bg-black text-white px-8 py-5 rounded-lg hover:bg-gray-800 transition"
          >
            Mua ngay
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="max-w-6xl mx-auto mt-12">
        <Divider
          orientation="left"
          className="text-lg font-semibold text-black"
        >
          Gợi ý thêm
        </Divider>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {suggestedBooks.map((book) => (
            <BookCard key={book.ISBN} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
