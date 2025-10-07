import React from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Table,
  Progress,
  Statistic,
} from "antd";
import { Bar } from "@ant-design/plots";

const { Title, Text } = Typography;
const { Content } = Layout;

const AdminDashboard = () => {
  // Mock data
  const totalUsers = 1200;
  const totalBooks = 450;
  const totalCategories = 25;
  const monthlyGrowth = 12.5;

  const topBooks = [
    { key: 1, title: "Đắc Nhân Tâm", readers: 980, progress: 98 },
    { key: 2, title: "Sapiens", readers: 850, progress: 85 },
    { key: 3, title: "Atomic Habits", readers: 790, progress: 79 },
    { key: 4, title: "Thinking Fast & Slow", readers: 700, progress: 70 },
    { key: 5, title: "The 7 Habits", readers: 650, progress: 65 },
    { key: 6, title: "Dune", readers: 600, progress: 60 },
    { key: 7, title: "1984", readers: 580, progress: 58 },
    { key: 8, title: "To Kill a Mockingbird", readers: 550, progress: 55 },
    { key: 9, title: "Harry Potter", readers: 530, progress: 53 },
    { key: 10, title: "Lord of the Rings", readers: 500, progress: 50 },
  ];

  const genreData = [
    { genre: "Kỹ năng sống", count: 320 },
    { genre: "Lịch sử", count: 240 },
    { genre: "Tự phát triển", count: 210 },
    { genre: "Khoa học viễn tưởng", count: 190 },
    { genre: "Tâm lý học", count: 160 },
  ];

  const recentActivity = [
    { key: 1, action: "Người dùng mới đăng ký", count: 25, time: "Hôm nay" },
    { key: 2, action: "Sách mới được thêm", count: 8, time: "Tuần này" },
    { key: 3, action: "Đánh giá mới", count: 156, time: "Tuần này" },
    { key: 4, action: "Hoạt động đọc", count: 1240, time: "Hôm nay" },
  ];

  const bookColumns = [
    {
      title: "Thứ hạng",
      key: "rank",
      width: 80,
      render: (_, __, index) => (
        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
          <Text className="text-sm font-semibold text-gray-700">
            {index + 1}
          </Text>
        </div>
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Text className="font-medium text-gray-900">{text}</Text>
      ),
    },
    {
      title: "Số người đọc",
      dataIndex: "readers",
      key: "readers",
      render: (readers) => (
        <Text className="font-semibold text-gray-800">
          {readers.toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Độ phổ biến",
      key: "progress",
      render: (_, record) => (
        <div className="w-24">
          <Progress
            percent={record.progress}
            size="small"
            strokeColor="#000"
            trailColor="#f3f4f6"
            showInfo={false}
          />
        </div>
      ),
    },
  ];

  const activityColumns = [
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
      render: (text) => (
        <Text className="font-medium text-gray-900">{text}</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      render: (count) => (
        <div className="px-3 py-1 bg-gray-100 rounded-full inline-block">
          <Text className="font-bold text-gray-800">{count}</Text>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      render: (time) => <Text className="text-gray-600">{time}</Text>,
    },
  ];

  // Biểu đồ Bar (Top 5 Genre)
  const genreConfig = {
    data: genreData,
    xField: "count",
    yField: "genre",
    seriesField: "genre",
    legend: false,
    color: "#000",
    barStyle: {
      radius: [0, 4, 4, 0],
    },
    xAxis: {
      grid: {
        line: {
          style: {
            stroke: "#f0f0f0",
            lineWidth: 1,
          },
        },
      },
      label: {
        style: {
          fill: "#666",
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: "#333",
          fontSize: 12,
          fontWeight: 500,
        },
      },
    },
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <Title
            level={1}
            className="mb-2 text-black font-bold text-3xl lg:text-4xl"
          >
            Dashboard Quản Trị
          </Title>
          <Text className="text-gray-600 text-lg">
            Tổng quan hệ thống thư viện số
          </Text>
        </div>

        {/* Thống kê nhanh */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <Statistic
                title={
                  <Text className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                    Tổng người dùng
                  </Text>
                }
                value={totalUsers}
                valueStyle={{
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-green-600 font-medium">
                  +{monthlyGrowth}% tháng này
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <Statistic
                title={
                  <Text className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                    Tổng sách
                  </Text>
                }
                value={totalBooks}
                valueStyle={{
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-blue-600 font-medium">
                  +8 sách mới tuần này
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <Statistic
                title={
                  <Text className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                    Thể loại
                  </Text>
                }
                value={totalCategories}
                valueStyle={{
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-purple-600 font-medium">
                  25 danh mục hoạt động
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <Statistic
                title={
                  <Text className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                    Tăng trưởng
                  </Text>
                }
                value={monthlyGrowth}
                suffix="%"
                valueStyle={{
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                }}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Text className="text-green-600 font-medium">
                  So với tháng trước
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Content Grid */}
        <Row gutter={[24, 24]}>
          {/* Top 10 sách */}
          <Col xs={24} lg={14}>
            <Card
              className="bg-white border-0 shadow-lg rounded-xl h-full"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-6 border-b border-gray-100">
                <Title level={3} className="mb-2 text-black font-bold">
                  Sách Phổ Biến Nhất
                </Title>
                <Text className="text-gray-600">
                  Top 10 sách có nhiều người đọc nhất trong tháng
                </Text>
              </div>
              <div className="overflow-hidden">
                <Table
                  dataSource={topBooks}
                  columns={bookColumns}
                  pagination={false}
                  rowKey="key"
                  className="modern-table"
                  size="middle"
                  rowClassName={(_, index) =>
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }
                />
              </div>
            </Card>
          </Col>

          {/* Hoạt động gần đây */}
          <Col xs={24} lg={10}>
            <Card
              className="bg-white border-0 shadow-lg rounded-xl h-full"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-6 border-b border-gray-100">
                <Title level={3} className="mb-2 text-black font-bold">
                  Hoạt Động Gần Đây
                </Title>
                <Text className="text-gray-600">
                  Tổng quan các hoạt động mới nhất
                </Text>
              </div>
              <div className="p-6">
                <Table
                  dataSource={recentActivity}
                  columns={activityColumns}
                  pagination={false}
                  rowKey="key"
                  showHeader={false}
                  size="middle"
                  className="activity-table"
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Top 5 Genre */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24}>
            <Card
              className="bg-white border-0 shadow-lg rounded-xl"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-6 border-b border-gray-100">
                <Title level={3} className="mb-2 text-black font-bold">
                  Thể Loại Được Ưa Chuộng
                </Title>
                <Text className="text-gray-600">
                  Top 5 thể loại sách có nhiều độc giả quan tâm nhất
                </Text>
              </div>
              <div className="p-6">
                <div style={{ height: "300px" }}>
                  <Bar {...genreConfig} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>

      <style jsx>{`
        .modern-table .ant-table-thead > tr > th {
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          padding: 16px;
        }
        .modern-table .ant-table-tbody > tr > td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .modern-table .ant-table-tbody > tr:hover > td {
          background-color: #f8fafc;
        }
        .activity-table .ant-table-tbody > tr > td {
          padding: 12px 0;
          border: none;
        }
        .activity-table .ant-table-tbody > tr:not(:last-child) > td {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </Layout>
  );
};

export default AdminDashboard;
