import React, { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Carousel,
  Rate,
  Badge,
} from "antd";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const [hoveredBook, setHoveredBook] = useState(null);

  // Dữ liệu mẫu cho sách nổi bật
  const featuredBooks = [
    {
      id: 1,
      title: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: "89,000",
      originalPrice: "120,000",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      rating: 4.8,
      reviews: 1250,
      discount: 26,
      category: "Kỹ năng sống",
    },
    {
      id: 2,
      title: "Sapiens: Lược Sử Loài Người",
      author: "Yuval Noah Harari",
      price: "156,000",
      originalPrice: "195,000",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      rating: 4.9,
      reviews: 986,
      discount: 20,
      category: "Lịch sử",
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      price: "132,000",
      originalPrice: "165,000",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      rating: 4.7,
      reviews: 2103,
      discount: 20,
      category: "Tự phát triển",
    },
    {
      id: 4,
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      price: "143,000",
      originalPrice: "178,000",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      rating: 4.6,
      reviews: 754,
      discount: 20,
      category: "Tâm lý học",
    },
    {
      id: 5,
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen R. Covey",
      price: "124,000",
      originalPrice: "155,000",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
      rating: 4.8,
      reviews: 1876,
      discount: 20,
      category: "Kỹ năng sống",
    },
    {
      id: 6,
      title: "Dune",
      author: "Frank Herbert",
      price: "167,000",
      originalPrice: "209,000",
      image:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      rating: 4.5,
      reviews: 623,
      discount: 20,
      category: "Khoa học viễn tưởng",
    },
  ];

  // Danh mục sách
  const categories = [
    "Văn học",
    "Kỹ năng sống",
    "Kinh tế",
    "Lịch sử",
    "Khoa học",
    "Tâm lý học",
    "Công nghệ",
    "Thiếu nhi",
  ];

  // Banner carousel data
  const bannerData = [
    {
      title: "Khuyến Mãi Cuối Năm",
      subtitle: "Giảm giá lên đến 50% cho tất cả sách",
      description:
        "Cơ hội tuyệt vời để sở hữu những cuốn sách hay với giá ưu đãi",
      bgColor: "bg-black",
    },
    {
      title: "Sách Mới Về Kho",
      subtitle: "Hàng trăm đầu sách mới nhất 2024",
      description: "Cập nhật những cuốn sách hot nhất hiện tại",
      bgColor: "bg-gray-800",
    },
    {
      title: "Miễn Phí Vận Chuyển",
      subtitle: "Cho đơn hàng từ 200,000đ",
      description: "Giao hàng nhanh chóng trên toàn quốc",
      bgColor: "bg-gray-900",
    },
  ];

  return (
    <Layout className="min-h-screen w-full bg-white">
      <Content>
        {/* Hero Banner */}
        <div className="bg-gray-50">
          <Carousel autoplay className="h-96">
            {bannerData.map((banner, index) => (
              <div key={index}>
                <div
                  className={`${banner.bgColor} h-96 flex items-center justify-center text-white relative overflow-hidden`}
                >
                  <div className="text-center max-w-4xl mx-auto px-8 z-10">
                    <Title
                      level={1}
                      className="!text-white !mb-4 text-5xl font-bold"
                    >
                      {banner.title}
                    </Title>
                    <Title level={3} className="!text-gray-300 !mb-6">
                      {banner.subtitle}
                    </Title>
                    <Paragraph className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                      {banner.description}
                    </Paragraph>
                    <Space size="middle">
                      <Button
                        size="large"
                        type="primary"
                        className="bg-white text-black border-white hover:bg-gray-100 px-8 py-6 h-auto text-base font-medium"
                      >
                        Mua ngay
                      </Button>
                      <Button
                        size="large"
                        className="border-white text-white hover:bg-white hover:text-black px-8 py-6 h-auto text-base font-medium"
                      >
                        Xem thêm
                      </Button>
                    </Space>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Categories Section */}
          <div className="py-16">
            <Title level={2} className="text-center mb-12 text-black">
              Danh Mục Sách
            </Title>
            <Row gutter={[16, 16]}>
              {categories.map((category, index) => (
                <Col xs={12} sm={8} md={6} lg={3} key={index}>
                  <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-black group">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-black transition-colors">
                      <div className="w-8 h-8 bg-gray-400 rounded group-hover:bg-white transition-colors"></div>
                    </div>
                    <Text className="font-medium text-black group-hover:text-black">
                      {category}
                    </Text>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <Row gutter={[24, 24]}>
            {featuredBooks.map((book) => (
              <Col xs={12} sm={8} md={6} lg={4} key={book.id}>
                <div className="h-full flex">
                  <Card
                    hoverable
                    className="flex flex-col w-full border-gray-200 hover:shadow-lg transition-shadow duration-300"
                    cover={
                      <div className="relative overflow-hidden h-64">
                        <img
                          alt={book.title}
                          src={book.image}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {book.discount > 0 && (
                          <Badge.Ribbon
                            text={`-${book.discount}%`}
                            color="red"
                            className="absolute top-2 right-2"
                          />
                        )}
                      </div>
                    }
                    bodyStyle={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                    }}
                    onMouseEnter={() => setHoveredBook(book.id)}
                    onMouseLeave={() => setHoveredBook(null)}
                  >
                    {/* Nội dung Card */}
                    <div className="flex flex-col h-full">
                      <Text className="text-xs text-gray-500 mb-2">
                        {book.category}
                      </Text>
                      <Title
                        level={5}
                        className="!mb-2 line-clamp-2 text-black"
                      >
                        {book.title}
                      </Title>
                      <Text className="text-gray-600 mb-3 text-sm">
                        {book.author}
                      </Text>

                      <div className="mb-3">
                        <Rate
                          disabled
                          defaultValue={book.rating}
                          className="text-xs"
                        />
                        <Text className="text-gray-500 ml-2 text-xs">
                          ({book.reviews})
                        </Text>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <Text className="text-lg font-bold text-black">
                              {book.price}đ
                            </Text>
                            {book.originalPrice && (
                              <Text
                                delete
                                className="text-gray-500 ml-2 text-sm"
                              >
                                {book.originalPrice}đ
                              </Text>
                            )}
                          </div>
                        </div>

                        <Button
                          type="primary"
                          block
                          className={`bg-black border-black hover:bg-gray-800 transition-all duration-300 ${
                            hoveredBook === book.id
                              ? "transform -translate-y-1"
                              : ""
                          }`}
                        >
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>

          {/* Features Section */}
          <div className="py-16 bg-gray-50 -mx-4 lg:-mx-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Title level={2} className="text-center mb-12 text-black">
                Tại Sao Chọn Chúng Tôi?
              </Title>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded"></div>
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Giao Hàng Nhanh
                    </Title>
                    <Paragraph className="text-gray-600">
                      Giao hàng trong 24h tại TP.HCM và Hà Nội. Miễn phí ship
                      cho đơn hàng trên 200,000đ.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded"></div>
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Chất Lượng Đảm Bảo
                    </Title>
                    <Paragraph className="text-gray-600">
                      100% sách chính hãng, bảo hành đổi trả trong 7 ngày nếu có
                      lỗi từ nhà sản xuất.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded"></div>
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Giá Tốt Nhất
                    </Title>
                    <Paragraph className="text-gray-600">
                      Cam kết giá tốt nhất thị trường. Hoàn tiền nếu bạn tìm
                      thấy giá rẻ hơn ở nơi khác.
                    </Paragraph>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="py-16">
            <div className="bg-black text-white rounded-2xl p-12 text-center">
              <Title level={2} className="!text-white mb-4">
                Đăng Ký Nhận Tin
              </Title>
              <Paragraph className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Nhận thông báo về sách mới, khuyến mãi đặc biệt và các sự kiện
                thú vị từ cửa hàng sách của chúng tôi.
              </Paragraph>
              <div className="flex max-w-md mx-auto">
                <Input
                  placeholder="Nhập email của bạn"
                  className="rounded-r-none"
                  size="large"
                />
                <Button
                  type="primary"
                  size="large"
                  className="bg-white text-black border-white hover:bg-gray-100 rounded-l-none"
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} className="!text-white mb-4">
                BookStore
              </Title>
              <Paragraph className="text-gray-300">
                Cửa hàng sách trực tuyến hàng đầu Việt Nam với hàng ngàn đầu
                sách chất lượng cao.
              </Paragraph>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5} className="!text-white mb-4">
                Liên kết
              </Title>
              <div className="space-y-2">
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Về chúng tôi
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Danh mục sách
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Khuyến mãi
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5} className="!text-white mb-4">
                Hỗ trợ
              </Title>
              <div className="space-y-2">
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Liên hệ
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Câu hỏi thường gặp
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Chính sách đổi trả
                  </a>
                </div>
                <div>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Hướng dẫn mua hàng
                  </a>
                </div>
              </div>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} className="!text-white mb-4">
                Liên hệ
              </Title>
              <div className="space-y-2 text-gray-300">
                <div>📍 123 Đường ABC, Quận 1, TP.HCM</div>
                <div>📞 (028) 1234 5678</div>
                <div>✉️ hello@bookstore.vn</div>
              </div>
            </Col>
          </Row>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <Text className="text-gray-400">
              © 2024 BookStore. Tất cả quyền được bảo lưu.
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage;
