import React from "react";
import { Card } from "antd";

const { Meta } = Card;

const BookCard = ({ book }) => {
  return (
    <Card
      hoverable
      className="shadow-md rounded-lg h-full flex flex-col"
      cover={
        <div className="w-full aspect-[6/3] overflow-hidden rounded-t-lg">
          <img
            alt={book["Book-Title"]}
            src={book["Image-URL-L"]}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MFY4MEg2NVY5MEg3NVpNMTM1IDkwVjgwSDEyNVY5MEgxMzVaTTc1IDEwMFY5MEg2NVYxMDBINzVaTTEzNSAxMDBWOTBIMTI1VjEwMEgxMzVaTTc1IDExMFYxMDBINjVWMTEwSDc1Wk0xMzUgMTEwVjEwMEgxMjVWMTEwSDEzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
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
            <p>NXB: {book["Publisher"]}</p>
            <p className="text-xs text-gray-500 mt-1">ISBN: {book.ISBN}</p>
          </div>
        }
      />
    </Card>
  );
};

export default BookCard;
