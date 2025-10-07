import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn tìm không tồn tại hoặc bạn không có quyền truy cập."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Quay lại trang chủ
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
