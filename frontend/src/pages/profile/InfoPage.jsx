import React, { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";

const InfoPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  // 🟢 Lấy thông tin user từ localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : {});
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
      setUser({});
    }
  }, []);

  // 🧭 Nếu chưa đăng nhập → chuyển hướng về trang login
  if (!user.username) {
    navigate("/auth");
    return null;
  }

  // 🟩 Dữ liệu hiển thị (với fallback)
  const userData = {
    fullName: user.fullName || "Chưa cập nhật",
    username: user.username || "Chưa cập nhật",
    email: user.email || "Chưa cập nhật",
    age: user.age ? `${user.age} tuổi` : "Chưa cập nhật",
    gender: user.gender || "Chưa cập nhật",
    avatar: user.avatar || "https://i.pravatar.cc/150?img=3", // Ảnh mặc định
  };

  const handleEditProfile = () => {
    // 🧭 Truyền user sang trang chỉnh sửa
    navigate("/profile/edit", { state: { user } });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 🧍‍♂️ Thông tin cơ bản */}
      <Card className="shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <Avatar size={100} src={userData.avatar} />

          {/* Họ tên và email */}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {userData.fullName}
            </h2>
            <p className="text-gray-600">{userData.email}</p>
            <Button
              type="default"
              className="mt-3 border-black text-black hover:bg-black hover:text-white"
              onClick={handleEditProfile}
            >
              Chỉnh sửa hồ sơ
            </Button>
          </div>
        </div>
      </Card>

      {/* 🧾 Chi tiết người dùng */}
      <Card className="shadow-sm">
        <Descriptions
          title={<span className="text-black font-semibold">Thông tin cá nhân</span>}
          bordered
          column={1}
          labelStyle={{ width: "150px", fontWeight: 500, color: "#000" }}
          contentStyle={{ color: "#333" }}
        >
          <Descriptions.Item label="Họ và tên">
            {userData.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Tên đăng nhập">
            {userData.username}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {userData.email}
          </Descriptions.Item>
          <Descriptions.Item label="Tuổi">
            {userData.age}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            {userData.gender}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default InfoPage;
