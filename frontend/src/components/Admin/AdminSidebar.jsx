import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <Sider width={220} className="bg-white border-r border-gray-200">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
          <Link to="/admin/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="/admin/books" icon={<BookOutlined />}>
          <Link to="/admin/books">Quản lý sách</Link>
        </Menu.Item>

        <Menu.Item key="/admin/users" icon={<UserOutlined />}>
          <Link to="/admin/users">Người dùng</Link>
        </Menu.Item>

        <Menu.Item key="/admin/orders" icon={<ShoppingCartOutlined />}>
          <Link to="/admin/orders">Đơn hàng</Link>
        </Menu.Item>

        <Menu.Item key="/admin/settings" icon={<SettingOutlined />}>
          <Link to="/admin/settings">Cài đặt</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AdminSidebar;
