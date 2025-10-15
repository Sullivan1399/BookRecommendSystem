import React, { useState, useEffect } from "react";
import { Card, Button, Tag, Spin, Input, Pagination, ConfigProvider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Papa from "papaparse";
import { addFavoriteGenre, getFavoriteGenres } from "../api/favorites";
import CustomModal from "../components/CustomModal";

const { Search } = Input;

const FavoriteGenrePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const CSV_URL =
    "https://raw.githubusercontent.com/Dhoa0102/book-categories-dataset/refs/heads/main/categories.csv";

  const showModal = (title, message, type = "info") => {
    setModalConfig({ visible: true, title, message, type });
  };

  const closeModal = () => setModalConfig({ ...modalConfig, visible: false });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const list = parsed.data.map((r) => r.category?.trim()).filter(Boolean);
        setGenres(list);
        setFilteredGenres(list);
      } catch (err) {
        showModal("Lỗi tải dữ liệu", "Không thể tải danh sách thể loại.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      showModal("Lỗi", "Không tìm thấy người dùng!", "error");
      return;
    }
    if (selectedGenres.length === 0) {
      showModal("Cảnh báo", "Hãy chọn ít nhất một thể loại!", "warning");
      return;
    }

    setSaving(true);
    let successCount = 0;
    let duplicateGenres = [];

    for (const genre of selectedGenres) {
      const res = await addFavoriteGenre(userId, genre);
      if (res.isDuplicate) duplicateGenres.push(genre);
      else if (res.success) successCount++;
    }

    setSaving(false);

    if (duplicateGenres.length > 0) {
      showModal(
        "Thể loại đã tồn tại",
        `Các thể loại sau đã có trong danh sách yêu thích:\n${duplicateGenres.join(", ")}`,
        "warning"
      );
    } else if (successCount > 0) {
      showModal("Thành công", `Đã thêm ${successCount} thể loại mới!`, "success");
    } else {
      showModal("Không có thay đổi", "Không có thể loại mới nào được thêm.", "info");
    }
  };

  const handleSearch = (value) => {
    const filtered = genres.filter((g) => g.toLowerCase().includes(value.toLowerCase()));
    setFilteredGenres(filtered);
    setCurrentPage(1);
  };

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const currentGenres = filteredGenres.slice(start, end);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thể loại..." />
      </div>
    );

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 text-black">
        <div className="max-w-3xl w-full text-center mb-10">
          <h1 className="text-3xl font-bold">Chọn thể loại bạn yêu thích</h1>
          <p className="text-gray-600 mt-2">
            Chúng tôi sẽ gợi ý sách dựa trên sở thích của bạn.
          </p>
        </div>

        <Search
          placeholder="Tìm kiếm thể loại..."
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400, marginBottom: 20 }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {currentGenres.map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <Card
                key={genre}
                hoverable
                onClick={() => toggleGenre(genre)}
                className={`cursor-pointer text-center py-4 ${
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

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredGenres.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />

        {/* ✅ Nút hành động */}
        <div className="flex justify-center gap-4 mt-10">
          <Button
            type="default"
            size="large"
            onClick={() => navigate("/profile/genre")}
            className="border-gray-400 text-gray-700 hover:text-black hover:border-black px-8 h-12 text-lg font-medium"
          >
            ← Quay lại
          </Button>

          <Button
            type="primary"
            size="large"
            loading={saving}
            onClick={handleSave}
            className="bg-black hover:bg-gray-900 px-8 h-12 text-lg font-semibold"
          >
            Lưu lựa chọn
          </Button>
        </div>

        <CustomModal 
          visible={modalConfig.visible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          onClose={closeModal}
        />
      </div>
    </ConfigProvider>
  );
};

export default FavoriteGenrePage;
