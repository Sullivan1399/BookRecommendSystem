import React from "react";
import { Breadcrumb, Layout, theme } from "antd";
import { Outlet, useLocation, Link } from "react-router-dom";
import AdminHeader from "../../components/Admin/AdminHeader";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const { Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();

  // Tách đường dẫn thành mảng
  const path = location.pathname.split("/").filter((path) => path);

  // Map tên path -> tên hiển thị
  const breadcrumbMap = {
    "": "BẢNG ĐIỀU KHIỂN",
    dashboard: "Dashboard",
    books: "Quản lý sách",
    add: "Thêm sách",
    edit: "Chỉnh sửa sách",
    users: "Quản lý người dùng",
    orders: "Quản lý đơn hàng",
    settings: "Cài đặt",
  };

  // Tạo breadcrumb items
  const breadcumbItems = [
    {
      title: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    ...path.map((item, index) => ({
      title: (
        <Link to={`/admin/${path.slice(1, index + 1).join("/")}`}>
          {breadcrumbMap[item] || item}
        </Link>
      ),
    })),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <AdminHeader />

      <Layout>
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <Layout
          style={{
            background: "#fff",
            borderRadius: borderRadiusLG,
            padding: "16px 24px",
            margin: "16px",
            flex: 1,
          }}
        >
          {/* Breadcrumb */}
          <Breadcrumb
            style={{
              marginBottom: 16,
            }}
            items={breadcumbItems}
          />

          <Content
            style={{
              padding: 16,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: "calc(100vh - 160px)",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
