import React, { useState } from "react";
import { Layout, Radio, Button, Space } from "antd";
import {
  FontSizeOutlined,
  UserOutlined,
  CalendarOutlined,
  ApartmentOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const { Sider } = Layout;

const BookListLayout = () => {
  const [sortKey, setSortKey] = useState("Book-Title");
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <Layout>
      {/* Nội dung chính */}
      <Layout style={{ padding: "24px" }}>
        <Outlet context={{ sortKey, sortOrder }} />
      </Layout>
    </Layout>
  );
};

export default BookListLayout;
