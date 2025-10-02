import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  SettingOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

const ProfileLayout = () => {
  const location = useLocation();

  return (
    <Layout>
      {/* Sidebar */}
      <Sider
        width={220}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div className="p-4 font-bold text-lg">Tài khoản</div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="/profile/info" icon={<UserOutlined />}>
            <Link to="/profile/info">Thông tin cá nhân</Link>
          </Menu.Item>
          <Menu.Item key="/profile/favorite-books" icon={<BookOutlined />}>
            <Link to="/profile/favorite-books">Sách yêu thích</Link>
          </Menu.Item>
          <Menu.Item key="/profile/orders" icon={<ShoppingCartOutlined />}>
            <Link to="/profile/orders">Đơn hàng</Link>
          </Menu.Item>
          <Menu.Item key="/profile/settings" icon={<SettingOutlined />}>
            <Link to="/profile/settings">Cài đặt</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout style={{ padding: "24px" }}>
        <Content
          style={{
            background: "#fff",
            padding: 24,
            minHeight: 360,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProfileLayout;
