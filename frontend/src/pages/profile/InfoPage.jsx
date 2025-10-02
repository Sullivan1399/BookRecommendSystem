import React, { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Button } from "antd";
import { useNavigate } from "react-router-dom";

const InfoPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  // Retrieve user data from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : {});
    } catch (e) {
      console.error("Invalid user data in localStorage:", e);
      setUser({});
    }
  }, []);

  // Redirect to login if no user data
  if (!user.username) {
    navigate("/auth");
    return null; // Prevent rendering until redirect
  }

  // Fallback values for missing fields
  const userData = {
    name: user.full_name || "Chưa cập nhật",
    email: user.email || "Chưa cập nhật",
    phone: user.phone || "Chưa cập nhật",
    address: user.address || "Chưa cập nhật",
    dob: user.dob || "Chưa cập nhật",
    avatar: user.avatar || "https://i.pravatar.cc/150?img=3", // Default avatar
  };
  const handleEditProfile = async () => {
    navigate("/profile/edit", { state: { user: userData } });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Thông tin user */}
      <Card className="shadow-sm">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <Avatar size={100} src={userData.avatar} />

          {/* Tên và email */}
          <div>
            <h2 className="text-2xl font-bold text-black">{userData.name}</h2>
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

      {/* Chi tiết cá nhân */}
      <Card className="shadow-sm">
        <Descriptions
          title={
            <span className="text-black font-semibold">Thông tin cá nhân</span>
          }
          bordered
          column={1}
          labelStyle={{ width: "150px", fontWeight: 500, color: "#000" }}
          contentStyle={{ color: "#333" }}
        >
          <Descriptions.Item label="Họ và tên">
            {userData.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{userData.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {userData.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {userData.dob}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {userData.address}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default InfoPage;
