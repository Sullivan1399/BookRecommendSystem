import React, { useMemo, useState, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Divider,
  Card,
  notification,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import BookCard from "../../components/BookCard";
import { searchBooks, searchNormalBooks } from "../../api/books"; // 🟢 import cả 2 API

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

const BooksSearchResultPage = () => {
  const [books, setBooks] = useState([]);
  const [value, setValue] = useState("");
  const [field, setField] = useState("Book-Title");
  const [sortBy, setSortBy] = useState("title-asc");
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🟢 Phân biệt giữa search thường và search vector
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";
    const k = params.get("k") || 5;
    const isVectorSearch = location.pathname.includes("search-vector");

    if (query) {
      if (isVectorSearch) {
        fetchVectorBooks(query, k);
      } else {
        fetchNormalBooks(field, query);
      }
    }
  }, [location.search, location.pathname]);

  // 🔹 Vector Search
  const fetchVectorBooks = async (query, k = 5) => {
    setLoading(true);
    try {
      const data = await searchBooks(query, k);
      setBooks(data);
      setValue(query);
    } catch (error) {
      notification.error({
        message: "Lỗi tìm kiếm vector",
        description: "Không thể tải kết quả tìm kiếm vector.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Normal Search
  const fetchNormalBooks = async (field, value) => {
    setLoading(true);
    try {
      const data = await searchNormalBooks(field, value);
      setBooks(data);
      setValue(value);
    } catch (error) {
      notification.error({
        message: "Lỗi tìm kiếm thường",
        description: "Không thể tải kết quả tìm kiếm.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Khi người dùng search từ sidebar
  const handleSearch = (val) => {
    setValue(val);
    if (val.trim()) {
      fetchNormalBooks(field, val);
    } else {
      setBooks([]);
    }
  };

  const handleDetailBook = (book) => {
    navigate("/books/details", { state: { book } });
  };

  const normalized = (s) => (s || "").toString().toLowerCase();

  // 🧠 Sắp xếp local
  const filteredAndSorted = useMemo(() => {
    const sorted = [...books].sort((a, b) => {
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
  }, [books, sortBy]);

  const clearFilters = () => {
    setValue("");
    setSortBy("title-asc");
    setView("grid");
    setBooks([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-black mb-2">
              Kết Quả Tìm Kiếm Sách
            </h1>
            <p className="text-gray-600">
              Kết quả cho từ khóa: {value || "Tất cả sách"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border border-gray-200 shadow-sm">
                <div className="space-y-6">
                  {/* Field Select */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Tìm Theo
                    </h3>
                    <Select
                      value={field}
                      onChange={(val) => setField(val)}
                      className="w-full"
                      options={[
                        { value: "Book-Title", label: "Tiêu đề" },
                        { value: "Book-Author", label: "Tác giả" },
                        { value: "Publisher", label: "Nhà xuất bản" },
                        { value: "ISBN", label: "ISBN" },
                      ]}
                    />
                  </div>

                  {/* Search */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Tìm Kiếm
                    </h3>
                    <Search
                      placeholder="Nhập từ khóa..."
                      allowClear
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onSearch={handleSearch}
                      prefix={<SearchOutlined className="text-gray-400" />}
                      className="w-full"
                    />
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* Sort */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Sắp Xếp
                    </h3>
                    <Select
                      value={sortBy}
                      onChange={(val) => setSortBy(val)}
                      options={SORT_OPTIONS}
                      className="w-full"
                      placeholder="Chọn cách sắp xếp"
                    />
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* View Toggle */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-3 uppercase tracking-wide">
                      Hiển Thị
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setView("grid")}
                        type={view === "grid" ? "primary" : "default"}
                        icon={<AppstoreOutlined />}
                        className={view === "grid" ? "bg-black border-black" : ""}
                      >
                        Lưới
                      </Button>
                      <Button
                        onClick={() => setView("list")}
                        type={view === "list" ? "primary" : "default"}
                        icon={<UnorderedListOutlined />}
                        className={view === "list" ? "bg-black border-black" : ""}
                      >
                        Danh sách
                      </Button>
                    </div>
                  </div>

                  <Divider className="my-4 border-gray-200" />

                  {/* Reset Button */}
                  <Button
                    block
                    onClick={clearFilters}
                    icon={<ReloadOutlined />}
                    className="border-gray-300 text-gray-700 hover:border-black hover:text-black"
                  >
                    Thiết lập lại
                  </Button>
                </div>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy{" "}
                <span className="font-semibold text-black">
                  {filteredAndSorted.length}
                </span>{" "}
                kết quả
              </p>
            </div>

            {loading ? (
              <div className="py-16 text-center">Đang tải...</div>
            ) : filteredAndSorted.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <SearchOutlined className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-black mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-4">
                  Hãy thử tìm kiếm với từ khóa khác
                </p>
                <Button
                  onClick={clearFilters}
                  className="border-black text-black hover:bg-black hover:text-white"
                >
                  Xóa bộ lọc
                </Button>
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
                  <div key={book._id} onClick={() => handleDetailBook(book)}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BooksSearchResultPage;
