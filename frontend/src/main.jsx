import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { notification } from "antd";
import "antd/dist/reset.css";

// Cấu hình global cho notification
notification.config({
  placement: "bottomRight", // góc hiển thị
  bottom: 50,               // khoảng cách từ cạnh dưới (px)
  duration: 3,              // thời gian tự đóng (giây)
  maxCount: 3,              // số lượng noti tối đa hiển thị cùng lúc
  rtl: false,               // nếu dùng giao diện RTL (right-to-left)
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
