import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";
import { getCurrentUser } from "../api/profile";

const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null); // null: chưa kiểm tra, true/false: kết quả

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const user = await getCurrentUser();
        setIsAdmin(!!user?.admin_status);
      } catch (error) {
        console.error("Lỗi xác thực quyền:", error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, []);

  // ⏳ Đang kiểm tra
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  // 🔴 Chưa đăng nhập
  if (isAdmin === null) {
    return <Navigate to="/auth" replace />;
  }

  // 🚫 Không phải admin → tới 404 luôn, KHÔNG reload
  if (isAdmin === false) {
    return <Navigate to="/404" replace />;
  }

  // ✅ Là admin → render bình thường
  return children;
};

export default AdminRoute;
