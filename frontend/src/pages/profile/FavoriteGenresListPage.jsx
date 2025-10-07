import React, { useEffect, useState } from "react";
import { Spin, Tag, Card, Button, message, Popconfirm } from "antd";
import { getFavoriteGenres, removeFavoriteGenre } from "../../api/favorites";
import { useNavigate } from "react-router-dom";

const FavoriteGenresListPage = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // genre đang được xóa
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getFavoriteGenres(1, 10);
      setGenres(data);
    } catch (error) {
      console.error("Lỗi khi lấy genres:", error);
      message.error("Không thể tải thể loại yêu thích.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (genre) => {
    try {
      setDeleting(genre);
      await removeFavoriteGenre(genre);
      message.success(`Đã xóa thể loại "${genre}"`);
      setGenres((prev) => prev.filter((item) => item.genre !== genre)); // cập nhật UI
    } catch (error) {
      message.error(error.message || "Lỗi khi xóa thể loại");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thể loại yêu thích..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">📖 Thể loại yêu thích</h1>
        <Button type="primary" onClick={() => navigate("/choose-genres")}>
          ➕ Thêm thể loại
        </Button>
      </div>

      {genres.length === 0 ? (
        <p className="text-gray-500">Bạn chưa chọn thể loại nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {genres.map((item) => (
            <Card
              key={item._id}
              className="shadow-md border rounded-lg text-center relative"
            >
              <Tag
                color="blue"
                className="px-4 py-2 text-base font-medium rounded-lg"
              >
                {item.genre}
              </Tag>
              <p className="text-xs text-gray-400 mt-2">
                Ngày thêm: {new Date(item.createdAt).toLocaleDateString()}
              </p>

              <Popconfirm
                title={`Xóa thể loại "${item.genre}"?`}
                okText="Xóa"
                cancelText="Hủy"
                onConfirm={() => handleRemove(item.genre)}
              >
                <Button
                  danger
                  size="small"
                  loading={deleting === item.genre}
                  className="mt-3"
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteGenresListPage;
