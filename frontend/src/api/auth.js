import { jwtDecode } from "jwt-decode"; // nhớ import jwtDecode

const API_URL = "http://127.0.0.1:8000/users";
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || "Đăng ký thất bại");
    }

    // ✅ lưu user_id vào localStorage để dùng sau
    if (data._id) {
      localStorage.setItem("user_id", data._id);
    }

    return data; // trả về user object
  } catch (error) {
    console.error("Register error:", error.message);
    throw error;
  }
};


  

// Hàm login
//export const login = async (username, password) => {
//   try {
//     const formData = new URLSearchParams();
//     formData.append("username", username);
//     formData.append("password", password);

//     const response = await fetch(`${API_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: formData.toString(),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.detail || "Đăng nhập thất bại");
//     }

//     const data = await response.json();

//     // Lưu token vào localStorage (nếu muốn)
//     if (data.access_token) {
//       localStorage.setItem("accesstoken", data.access_token);
//       localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
//     }

//     return data;
//   } catch (error) {
//     console.error("Login error:", error.message);
//     throw error;
//   }


// TEST
//     try {
//         // Fake login check
//         if (username === "dat" && password === "1") {
//         const data = {
//             access_token: "123",
//             token_type: "bearer",
//             user: {
//                 username: "dat",
//                 full_name: "Nguyen Van Dat",
//                 email: "dat@example.com",
//                 avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png", // Fake avatar URL
//                 role: "user",
//             },
//         };

//         // Lưu token fake
//         localStorage.setItem("accesstoken", data.access_token);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         return data;
//         }

//         // Nếu không khớp thì throw error
//         throw new Error("Sai username hoặc password!");
//     } catch (error) {
//         console.error("Login error:", error.message);
//         throw error;
//     }
// };
// Hàm login
export const login = async (username, password) => {
    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "password");   // ✅ thêm grant_type
        formData.append("username", username);
        formData.append("password", password);
        formData.append("scope", "");                // scope có thể để rỗng
        formData.append("client_id", "string");      // backend yêu cầu
        formData.append("client_secret", "********"); // thay bằng secret thực tế nếu backend check

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Đăng nhập thất bại");
        }

        const data = await response.json();

        // ✅ Lưu token
        if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);

            // ✅ Giải nén JWT để lấy user info
            const decoded = jwtDecode(data.access_token);
            if (decoded) {
                const userId = decoded.sub;       // sub = user_id
                const username = decoded.username;
                localStorage.setItem("username", username);
                localStorage.setItem("user_id", userId);
                console.log("Decoded user_id:", userId);
            }
        }

        return data;
    } catch (error) {
        console.error("Login error:", error.message);
        throw error;
    }
};

// Optional: Function to log out and clear storage
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};