import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/profile"; // API gọi /users/me

/**
 * Hook phân quyền tự động:
 *  - Nếu là admin → chuyển đến /admin/manage-books
 *  - Nếu không → chuyển về trang chủ /
 */
export function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/auth");
          return;
        }

        const user = await getCurrentUser(); // Gọi API /users/me

        if (user?.admin_status) {
          console.log("Admin detected → chuyển đến /admin/manage-books");
          navigate("/admin/manage-books");
        } else {
          console.log("👤 User thường → chuyển đến /");
          navigate("/");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra phân quyền:", error);
        navigate("/auth"); // Token sai hoặc lỗi API
      }
    };

    checkUserRole();
  }, [navigate]);
}
