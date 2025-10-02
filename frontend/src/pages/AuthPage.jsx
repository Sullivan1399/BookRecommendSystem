import React, { useState, useCallback } from "react";
import { Eye, EyeOff, Book, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { login, register } from "../api/auth";
import { useNavigate } from "react-router-dom";

// Memoized InputField component to prevent unnecessary re-renders
const InputField = React.memo(
  ({ icon: Icon, type, placeholder, name, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name={name}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
          required
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
      </div>
    );
  }
);

// Button component
const Button = ({
  children,
  loading,
  variant = "primary",
  type = "button",
}) => (
  <button
    type={type}
    disabled={loading}
    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
      variant === "primary"
        ? "bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
        : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50" // Đổi text-black thành text-gray-900 (hoặc text-black)
    } ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
  >
    {loading ? "Đang xử lý..." : children}
  </button>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotForm, setForgotForm] = useState({ email: "" });

  // Memoized change handler
  const handleChange = useCallback(
    (setter) => (e) => {
      const { name, value } = e.target;
      setter((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await login(loginForm.username, loginForm.password);
      setMessage("Đăng nhập thành công!");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
  
    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      setIsLoading(false);
      return;
    }
  
    try {
      const newUser = {
        username: signupForm.email.split("@")[0], // hoặc cho người dùng nhập username riêng
        email: signupForm.email,
        fullName: signupForm.fullName,
        age: 18, // hoặc thêm input cho tuổi
        gender: "nam", // hoặc thêm select box cho gender
        password: signupForm.password,
      };
  
      await register(newUser);
      setMessage("Đăng ký thành công! Vui lòng đăng nhập.");
      setActiveTab("login");
      setSignupForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Fake API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage("Link đặt lại mật khẩu đã được gửi đến email của bạn.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-black p-3 rounded-full mb-3">
            <Book className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">BookStore</h1>
          <p className="text-gray-600 text-sm mt-1">
            Thế giới sách số 1 Việt Nam
          </p>
        </div>

        {/* Auth Container */}
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {/* Tabs */}
          {activeTab !== "forgot" && (
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("login")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "login"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Đăng Ký
              </button>
            </div>
          )}

          {/* Back button for forgot */}
          {activeTab === "forgot" && (
            <button
              onClick={() => setActiveTab("login")}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại đăng nhập
            </button>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.includes("thành công")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Chào mừng trở lại
              </h2>

              <InputField
                key="login-username"
                icon={Mail}
                type="text"
                name="username"
                placeholder="Email hoặc Username"
                value={loginForm.username}   // ✅ đúng key
                onChange={handleChange(setLoginForm)}
              />

              <InputField
                key="login-password"
                icon={Lock}
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={loginForm.password}
                onChange={handleChange(setLoginForm)}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-black focus:ring-gray-500"
                  />
                  <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab("forgot")}
                  className="text-black hover:text-gray-700 font-medium"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button className="w-full bg-black p-2 flex items-center justify-center rounded-xl cursor-pointer hover:bg-gray-900" loading={isLoading}>
                <span className="text-white">Đăng Nhập</span>
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tạo tài khoản mới
              </h2>

              <InputField
                key="signup-fullname"
                icon={User}
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={signupForm.fullName}
                onChange={handleChange(setSignupForm)}
              />

              <InputField
                key="signup-email"
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={signupForm.email}
                onChange={handleChange(setSignupForm)}
              />

              <InputField
                key="signup-password"
                icon={Lock}
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={signupForm.password}
                onChange={handleChange(setSignupForm)}
              />

              <InputField
                key="signup-confirm-password"
                icon={Lock}
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={signupForm.confirmPassword}
                onChange={handleChange(setSignupForm)}
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-white focus:ring-gray-100 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Tôi đồng ý với{" "}
                  <button className="text-black hover:text-gray-700 font-medium underline">
                    Điều khoản dịch vụ
                  </button>{" "}
                  và{" "}
                  <button className="text-black hover:text-gray-700 font-medium underline">
                    Chính sách bảo mật
                  </button>
                </span>
              </div>

              <button className="w-full bg-black p-2 flex items-center justify-center rounded-xl cursor-pointer hover:bg-gray-900" loading={isLoading}>
                <span className="text-white">Tạo tài khoản</span>
              </button>
            </form>
          )}

          {/* Forgot Password */}
          {activeTab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quên mật khẩu?
                </h2>
                <p className="text-gray-600 text-sm">
                  Nhập email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
                </p>
              </div>

              <InputField
                key="forgot-email"
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email của bạn"
                value={forgotForm.email}
                onChange={handleChange(setForgotForm)}
              />

              <Button type="submit" loading={isLoading}>
                Gửi Link Đặt Lại
              </Button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 BookStore. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
