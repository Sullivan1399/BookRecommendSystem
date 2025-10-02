import React, { useMemo, useState, useEffect } from "react";
import { Select, Input, Button, Spin , Card } from "antd";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../api/books";  // import API

import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BookCard from "../../components/BookCard";

const { Search } = Input;

const SORT_OPTIONS = [
  { value: "title-asc", label: "Tiêu đề: A → Z" },
  { value: "title-desc", label: "Tiêu đề: Z → A" },
  { value: "author-asc", label: "Tác giả: A → Z" },
  { value: "author-desc", label: "Tác giả: Z → A" },
  { value: "year-newest", label: "Năm xuất bản: Mới → Cũ" },
  { value: "year-oldest", label: "Năm xuất bản: Cũ → Mới" },
  { value: "publisher-asc", label: "Nhà xuất bản: A → Z" },
];

const BooksListPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");
  const [view, setView] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";
    const k = params.get("k") || 5;
  
    if (query) {
      setQuery(query);          // lưu lại để hiện ở UI
      fetchBooks(query, k);     // gọi API search
    }
  }, [location.search]);
  
  const fetchBooks = async (query, k) => {
    setLoading(true);
    try {
      const data = await searchBooks(query, k); // dùng API search
      setBooks(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDetailBook = (book) => {
    navigate("/books/details", { state: { book } });
  };
  const normalized = (s) => (s || "").toString().toLowerCase();

  const filteredAndSorted = useMemo(() => {
    const filtered = books.filter((b) => {
      const q = normalized(query);
      if (!q) return true;
      return (
        normalized(b["Book-Title"]).includes(q) ||
        normalized(b["Book-Author"]).includes(q) ||
        normalized(b.Publisher).includes(q) ||
        normalized(b.ISBN).includes(q)
      );
    });

    const sorted = filtered.sort((a, b) => {
      switch (sortBy) {
        case "title-asc":
          return normalized(a["Book-Title"]).localeCompare(normalized(b["Book-Title"]));
        case "title-desc":
          return normalized(b["Book-Title"]).localeCompare(normalized(a["Book-Title"]));
        case "author-asc":
          return normalized(a["Book-Author"]).localeCompare(normalized(b["Book-Author"]));
        case "author-desc":
          return normalized(b["Book-Author"]).localeCompare(normalized(a["Book-Author"]));
        case "year-newest":
          return Number(b["Year-Of-Publication"] || 0) - Number(a["Year-Of-Publication"] || 0);
        case "year-oldest":
          return Number(a["Year-Of-Publication"] || 0) - Number(b["Year-Of-Publication"] || 0);
        case "publisher-asc":
          return normalized(a.Publisher).localeCompare(normalized(b.Publisher));
        default:
          return 0;
      }
    });

    return sorted;
  }, [books, query, sortBy]);

  const clearFilters = () => {
    setQuery("");
    setSortBy("title-asc");
    setView("grid");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Đang tải sách..." />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white">
      {/* giữ nguyên UI code... */}
      <main className="lg:col-span-3">
        {/* Header kết quả */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            Tìm thấy <span className="font-semibold text-black">{filteredAndSorted.length}</span> kết quả
          </p>
        </div>

        {/* Hiển thị danh sách */}
        {filteredAndSorted.length === 0 ? (
          <div className="py-16 text-center">
            <SearchOutlined className="text-2xl text-gray-400 mb-2" />
            <p>Không tìm thấy kết quả</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSorted.map((book) => (
              <div key={book.ISBN} onClick={() => handleDetailBook(book)}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSorted.map((book) => (
              <Card key={book.ISBN} hoverable>
                <div className="flex gap-4 items-center">
                  <img src={book["Image-URL-L"]} alt={book["Book-Title"]} className="w-20 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{book["Book-Title"]}</h3>
                    <p>Tác giả: {book["Book-Author"]}</p>
                    <p>NXB: {book.Publisher}</p>
                    <p className="text-xs text-gray-500">ISBN: {book.ISBN} • Năm: {book["Year-Of-Publication"]}</p>
                  </div>
                  <Button type="primary">Mua ngay</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BooksListPage;
