const API_URL = "http://127.0.0.1:8000/users";

// Lấy user hiện tại từ token trong localStorage
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Chưa có token, cần login trước!");
    }

    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token cho backend
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Không lấy được thông tin user");
    }

    const userData = await response.json();

    // Lưu user info vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("Get current user error:", error.message);
    throw error;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("Chưa có token, cần login trước!");
    }
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi token cho backend
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Cập nhật profile thất bại");
    }
    const updatedUser = await response.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  }
  catch (error) {
    console.error("Update profile error:", error.message);
    throw error;
  }
}
