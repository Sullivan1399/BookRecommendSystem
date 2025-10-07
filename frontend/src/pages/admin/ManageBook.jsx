import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  notification,
  Pagination,
  Divider,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { getBooks, insertBook, updateBook, deleteBook } from "../../api/books";

const ManageBook = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        notify("error", "Lỗi tải dữ liệu", "Không thể tải danh sách sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const notify = (type, msg, desc) => {
    notification[type]({
      message: msg,
      description: desc,
      placement: "topRight",
    });
  };

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) => {
      return (
        (b["Book-Title"] || "").toLowerCase().includes(q) ||
        (b["Book-Author"] || "").toLowerCase().includes(q) ||
        (b["Publisher"] || "").toLowerCase().includes(q) ||
        (b.ISBN || "").toLowerCase().includes(q)
      );
    });
  }, [books, query]);

  const columns = [
    {
      title: "Bìa",
      dataIndex: "Image-URL-L",
      key: "cover",
      width: 120,
      render: (url, record) => (
        <div className="w-20 h-28 overflow-hidden rounded">
          <img
            src={url}
            alt={record["Book-Title"]}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgdmlld0JveD0iMCAwIDIwMCAyNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MFY4MEg2NVY5MEg3NVpNMTM1IDkwVjgwSDEyNVY5MEgxMzVaTTc1IDEwMFY5MEg2NVYxMDBINzVaTTEzNSAxMDBWOTBIMTI1VjEwMEgxMzVaTTc1IDExMFYxMDBINjVWMTEwSDc1Wk0xMzUgMTEwVjEwMEgxMjVWMTEwSDEzNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
            }}
          />
        </div>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "Book-Title",
      key: "title",
      sorter: (a, b) =>
        (a["Book-Title"] || "").localeCompare(b["Book-Title"] || ""),
      render: (t) => <div className="font-semibold line-clamp-2">{t}</div>,
    },
    {
      title: "Tác giả",
      dataIndex: "Book-Author",
      key: "author",
      sorter: (a, b) =>
        (a["Book-Author"] || "").localeCompare(b["Book-Author"] || ""),
    },
    {
      title: "NXB",
      dataIndex: "Publisher",
      key: "publisher",
    },
    {
      title: "Năm",
      dataIndex: "Year-Of-Publication",
      key: "year",
      sorter: (a, b) =>
        (Number(a["Year-Of-Publication"]) || 0) -
        (Number(b["Year-Of-Publication"]) || 0),
      width: 90,
      align: "center",
    },
    {
      title: "ISBN",
      dataIndex: "ISBN",
      key: "isbn",
      width: 140,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)} size="small">
            Sửa
          </Button>
          <Popconfirm
            title={`Xóa "${record["Book-Title"]}"?`}
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const pagedData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    form.setFieldsValue({
      ISBN: book.ISBN,
      title: book["Book-Title"],
      author: book["Book-Author"],
      year: Number(book["Year-Of-Publication"]) || undefined,
      publisher: book.Publisher,
      image: book["Image-URL-L"],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId) => {
    setLoading(true);
    try {
      await deleteBook(bookId);
      const updatedBooks = await getBooks();
      setBooks(updatedBooks);
      notify("success", "Xóa thành công", `Đã xóa sách có ID ${bookId}`);
    } catch (error) {
      if (error.message.includes("401")) {
        notify("error", "Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
      } else {
        notify("error", "Lỗi xóa", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const payload = {
      ISBN: values.ISBN,
      "Book-Title": values.title,
      "Book-Author": values.author,
      "Year-Of-Publication": Number(values.year) || null,
      Publisher: values.publisher,
      Category: values.category || null,
      Description: values.description || "", // 🆕 thêm dòng này
      "Image-URL-S": values.image_s || "",
      "Image-URL-M": values.image_m || "",
      "Image-URL-L": values.image_l || "",
    };
    
  
    try {
      if (editing) {
        await updateBook(editing._id, payload);
        notify("success", "Cập nhật thành công", `"${payload["Book-Title"]}" đã được cập nhật.`);
      } else {
        await insertBook(payload);
        notify("success", "Thêm thành công", `"${payload["Book-Title"]}" đã được thêm.`);
      }
      const updatedBooks = await getBooks();
      setBooks(updatedBooks);
    } catch (error) {
      notify("error", "Lỗi", error.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      form.resetFields();
    }
  };
  

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quản lý sách</h1>
            <p className="text-sm text-gray-600">Trang admin CRUD — dữ liệu từ backend</p>
          </div>
          <div className="flex gap-3 items-center">
            <Input.Search
              placeholder="Tìm theo tiêu đề, tác giả, NXB, ISBN"
              allowClear
              onSearch={(val) => {
                setQuery(val);
                setPage(1);
              }}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 360 }}
            />
            <Button type="primary" onClick={openCreate} icon={<PlusOutlined />}>
              Thêm sách
            </Button>
          </div>
        </div>

        <Divider className="my-2" />

        {/* Table */}
        <div className="bg-white rounded-md border border-gray-100 p-2">
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={pagedData}
            pagination={false}
            loading={loading}
            locale={{ emptyText: "Không có sách." }}
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">{filtered.length} kết quả</div>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={filtered.length}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editing ? "Sửa sách" : "Thêm sách"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editing ? "Lưu" : "Tạo"}
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="ISBN"
            name="ISBN"
            rules={[{ required: true, message: "Nhập ISBN" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Nhập tiêu đề" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tác giả"
            name="author"
            rules={[{ required: true, message: "Nhập tác giả" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="NXB"
            name="publisher"
            rules={[{ required: true, message: "Nhập nhà xuất bản" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Năm xuất bản" name="year">
            <InputNumber style={{ width: "100%" }} min={1800} max={2100} />
          </Form.Item>

          <Form.Item label="Thể loại" name="category">
            <Input placeholder="Ví dụ: Văn học, Kinh doanh..." />
          </Form.Item>

          {/* 🆕 Thêm trường mô tả sách */}
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sách" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn về nội dung sách..." />
          </Form.Item>

          <Form.Item label="Ảnh bìa nhỏ (URL-S)" name="image_s">
            <Input placeholder="http://..." />
          </Form.Item>

          <Form.Item label="Ảnh bìa vừa (URL-M)" name="image_m">
            <Input placeholder="http://..." />
          </Form.Item>

          <Form.Item label="Ảnh bìa lớn (URL-L)" name="image_l">
            <Input placeholder="http://..." />
          </Form.Item>
        </Form>

      </Modal>

    </div>
  );
};

export default ManageBook;
