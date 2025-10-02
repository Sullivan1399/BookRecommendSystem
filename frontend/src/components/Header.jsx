import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Button, Input, Avatar, Menu } from "antd";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { getCurrentUser } from "../api/profile"; // import hàm API /me

const { Header } = Layout;
const { Search } = Input;

const HeaderNavbar = () => {
  const [position] = useState("end");
  const [isHover, setIsHover] = useState(false);
  const [user, setUser] = useState(null); // ✅ lưu user vào state
  const navigate = useNavigate();

  // Lấy user từ API /me khi component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser(); // call API
        setUser(data); // lưu vào state
        console.log(data)
      } catch (error) {
        console.error("Không lấy được user:", error.message);
      }
    };
    fetchUser();
  }, []);

  const categoryItems = [
    { key: "1", label: <a href="/category/van-hoc">Văn học</a> },
    { key: "2", label: <a href="/category/kinh-doanh">Kinh doanh</a> },
    { key: "3", label: <a href="/category/khoa-hoc">Khoa học</a> },
    { key: "4", label: <a href="/category/thieu-nhi">Thiếu nhi</a> },
    { key: "5", label: <a href="/category/cong-nghe">Công nghệ</a> },
  ];

  const buttons = [
    { text: "Bộ sách", href: "/books/list" },
    { text: "Bán chạy", href: "/best-sellers" },
    { text: "Khuyến mãi", href: "/sale" },
    { text: "Liên hệ", href: "/contact" },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Xem hồ sơ
      </Menu.Item>
      <Menu.Item
        key="logout"
        onClick={() => {
          logout();
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
          navigate("/");
        }}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/books/search?query=${encodeURIComponent(value)}&k=5`);
    }
  };
  

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        padding: "0 20px",
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center w-[15%] h-fit">
        <a href="/" className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="Logo"
            width="32"
            height="32"
          />
          <span className="text-lg font-bold text-black">BookStore</span>
        </a>
      </div>

      {/* Search */}
      <div className="flex items-center ml-auto w-[500px] mx-8">
        <Search
          placeholder="Tìm kiếm sách..."
          allowClear
          enterButton={<SearchOutlined />}
          size="middle"
          onSearch={onSearch} // dùng hàm đã sửa
        />
      </div>

      {/* Navigation + User */}
      <div className="flex flex-row justify-between items-center h-full w-[50%]">
        {/* Dropdown danh mục */}
        <Dropdown menu={{ items: categoryItems }} placement="bottom" arrow>
          <Button
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              backgroundColor: isHover ? "#f5f6fa" : "transparent",
              color: "black",
              fontWeight: "bold",
              boxShadow: "none",
              border: "none",
              height: "100%",
              marginRight: "15px",
            }}
            icon={isHover ? <CaretDownOutlined /> : <CaretUpOutlined />}
            iconPosition={position}
          >
            Danh mục
          </Button>
        </Dropdown>

        {/* Các nút */}
        {buttons.map((button, index) => (
          <Button
            key={index}
            href={button.href}
            style={{
              color: "black",
              fontWeight: "bold",
              boxShadow: "none",
              border: "none",
              height: "100%",
              marginRight: "15px",
            }}
          >
            {button.text}
          </Button>
        ))}

        {/* User avatar / login */}
        {localStorage.getItem("access_token") && user ? (
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Avatar
              style={{ cursor: "pointer", marginRight: "15px" }}
              icon={<UserOutlined />}
              src={user.avatar || null}
            >
              {user.fullName
                ? user.fullName[0]
                : user.username
                ? user.username[0]
                : ""}
            </Avatar>
          </Dropdown>
        ) : (
          <Button
            style={{
              color: "black",
              fontWeight: "bold",
              boxShadow: "none",
              border: "none",
              height: "100%",
              marginRight: "15px",
            }}
            onClick={() => navigate("/auth")}
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </Header>
  );
};

export default HeaderNavbar;
