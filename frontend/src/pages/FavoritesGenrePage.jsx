import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Spin, message, Input, Pagination } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Papa from "papaparse";
import { addFavoriteGenre, getFavoriteGenres } from "../api/favorites";

const { Search } = Input;
const CSV_URL =
  "https://raw.githubusercontent.com/Dhoa0102/book-categories-dataset/refs/heads/main/categories.csv";

const FavoriteGenrePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [genres, setGenres] = useState([]); // ✅ Tất cả thể loại từ CSV
  const [filteredGenres, setFilteredGenres] = useState([]); // ✅ Kết quả sau khi search
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // ✅ Mỗi trang 9 phần tử

  const isFromProfile = location.pathname.includes("/profile");
  const isFromAuth = location.state?.fromSignup;

  // ✅ 1. Load danh sách thể loại từ GitHub CSV
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        const genreList = parsed.data
          .map((row) => row.category?.trim())
          .filter((item) => !!item);

        setGenres(genreList);
        setFilteredGenres(genreList);
      } catch (err) {
        console.error("Lỗi khi tải CSV:", err);
        message.error("Không thể tải danh sách thể loại!");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // ✅ 2. Nếu đến từ /profile → load danh sách đã lưu
  useEffect(() => {
    const fetchExistingGenres = async () => {
      const token = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

      if (!isFromAuth && (!token || !userId)) {
        navigate("/auth");
        return;
      }

      if (isFromProfile) {
        try {
          const data = await getFavoriteGenres(1, 50);
          const existingGenres = data.map((g) => g.genre.trim());
          setSelectedGenres(existingGenres);
        } catch (err) {
          console.error("Lỗi khi tải genres đã lưu:", err);
        }
      }
    };

    fetchExistingGenres();
  }, [isFromProfile, isFromAuth, navigate]);

  // ✅ Toggle chọn / bỏ chọn
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  // ✅ Lưu danh sách yêu thích
  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      message.error("Không tìm thấy người dùng!");
      return;
    }

    if (selectedGenres.length === 0) {
      message.warning("Hãy chọn ít nhất một thể loại!");
      return;
    }

    setSaving(true);
    try {
      for (const genre of selectedGenres) {
        await addFavoriteGenre(userId, genre);
      }

      message.success("Đã lưu thể loại yêu thích!");
      if (isFromAuth) navigate("/auth");
      else navigate("/profile/genre");
    } catch (err) {
      message.error(err.message || "Không thể lưu thể loại!");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Xử lý tìm kiếm
  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    const filtered = genres.filter((g) =>
      g.toLowerCase().includes(keyword)
    );
    setFilteredGenres(filtered);
    setCurrentPage(1); // reset về trang đầu khi tìm kiếm
  };

  // ✅ Phân trang (chia danh sách)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentGenres = filteredGenres.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thể loại yêu thích..." />
      </div>
    );
  }

  // ✅ Giao diện
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 text-black">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {isFromProfile
              ? "Cập nhật thể loại yêu thích"
              : "Chọn thể loại bạn yêu thích"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isFromProfile
              ? "Bạn có thể thêm hoặc bỏ chọn thể loại cũ."
              : "Chúng tôi sẽ gợi ý sách dựa trên sở thích của bạn."}
          </p>
        </div>

        {/* ✅ Thanh tìm kiếm */}
        <div className="flex justify-center mb-6">
          <Search
            placeholder="Tìm kiếm thể loại..."
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>

        {/* ✅ Danh sách thể loại (phân trang) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {currentGenres.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Card
                key={genre}
                hoverable
                onClick={() => toggleGenre(genre)}
                className={`cursor-pointer text-center py-4 transition-all duration-200 ${
                  isSelected ? "border-blue-500 shadow-md" : "border-gray-200"
                }`}
              >
                <Tag
                  color={isSelected ? "blue" : "default"}
                  className="px-4 py-2 text-base rounded-lg"
                >
                  {genre}
                </Tag>
              </Card>
            );
          })}
        </div>

        {/* ✅ Phân trang */}
        <div className="flex justify-center mb-10">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredGenres.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>

        {/* ✅ Nút lưu */}
        <div className="flex justify-center">
          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={handleSave}
            className="bg-black hover:bg-gray-900 px-8 h-12 text-lg font-semibold"
          >
            {isFromProfile ? "Cập nhật" : "Tiếp tục"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteGenrePage;
