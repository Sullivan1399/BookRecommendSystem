import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
} from "antd";

const initialUsers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    role: "User",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@example.com",
    role: "Admin",
  },
];

const ManageUser = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Mở modal
  const showModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Lưu user
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingUser) {
          // Cập nhật user
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...editingUser, ...values } : u
            )
          );
          message.success("Cập nhật người dùng thành công");
        } else {
          // Thêm mới user
          const newUser = { id: Date.now(), ...values };
          setUsers([...users, newUser]);
          message.success("Thêm người dùng thành công");
        }
        setIsModalOpen(false);
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  // Xóa user
  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    message.success("Xóa người dùng thành công");
  };

  // Tìm kiếm
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình bảng
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Input.Search
          placeholder="Tìm kiếm theo tên hoặc email"
          onSearch={(value) => setSearchText(value)}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" onClick={() => showModal()}>
          Thêm User
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Modal thêm/sửa */}
      <Modal
        title={editingUser ? "Chỉnh sửa User" : "Thêm User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng nhập vai trò" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUser;
