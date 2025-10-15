import React from "react";
import { useNavigate } from "react-router-dom";

const CustomModal = ({ visible, title, message, onClose, type = "info" }) => {
  const navigate = useNavigate();

  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          button: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "success":
        return {
          icon: "text-green-500",
          button: "bg-green-600 hover:bg-green-700",
        };
      default:
        return {
          icon: "text-blue-500",
          button: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 19h14.14c1.33 0 2.23-1.45 1.54-2.67L13.54 4.67a1.77 1.77 0 00-3.08 0L3.39 16.33C2.7 17.55 3.6 19 4.93 19z" />
          </svg>
        );
      case "success":
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const styles = getStyles();

  const handleClose = () => {
    // ✅ Nếu modal là success → điều hướng về trang /profile/genre
    if (type === "success") {
      navigate("/profile/genre");
    }
    onClose(); // Gọi hàm đóng modal bình thường
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`${styles.icon}`}>{getIcon()}</div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-base leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={handleClose}
            className={`w-full py-3 ${styles.button} text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
