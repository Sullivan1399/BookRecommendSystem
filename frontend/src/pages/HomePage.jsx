import React, { useState, useEffect } from "react";
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
  Spin,
} from "antd";

import {
  BookOutlined,
  SmileOutlined,
  MoneyCollectOutlined,
  RocketOutlined,
  BulbOutlined,
  HistoryOutlined,
  CodeOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

import BookCard from "../components/BookCard";
import {getLatestBooks,getRecommededBooks } from  "../api/books"
const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const [hoveredBook, setHoveredBook] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(true);
  
  // ✅ Gọi API lấy 6 sách đầu tiên khi load trang
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Chạy song song 2 API
        const [latest, recommended] = await Promise.all([
          getLatestBooks(),
          getRecommededBooks(),
        ]);
  
        setFeaturedBooks(latest || []);
        setRecommendedBooks(recommended || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sách:", err);
      } finally {
        setLoadingBooks(false);
      }
    };
  
    fetchBooks();
  }, []);
  
  

  const categories = [
    {
      name: "Văn học",
      icon: <BookOutlined style={{ fontSize: 32 }} />,
      color: "#1890ff",
      count: "1,234",
    },
    {
      name: "Kỹ năng sống",
      icon: <SmileOutlined style={{ fontSize: 32 }} />,
      color: "#52c41a",
      count: "856",
    },
    {
      name: "Kinh tế",
      icon: <MoneyCollectOutlined style={{ fontSize: 32 }} />,
      color: "#faad14",
      count: "672",
    },
    {
      name: "Lịch sử",
      icon: <HistoryOutlined style={{ fontSize: 32 }} />,
      color: "#722ed1",
      count: "543",
    },
    {
      name: "Khoa học",
      icon: <BulbOutlined style={{ fontSize: 32 }} />,
      color: "#fa541c",
      count: "789",
    },
    {
      name: "Tâm lý học",
      icon: <TeamOutlined style={{ fontSize: 32 }} />,
      color: "#eb2f96",
      count: "421",
    },
    {
      name: "Công nghệ",
      icon: <CodeOutlined style={{ fontSize: 32 }} />,
      color: "#13c2c2",
      count: "956",
    },
    {
      name: "Thiếu nhi",
      icon: <RocketOutlined style={{ fontSize: 32 }} />,
      color: "#f759ab",
      count: "1,089",
    },
  ];

  // Banner carousel data
  // 🖼 Banner carousel data
const bannerData = [
  {
    title: "Khuyến Mãi Cuối Năm",
    subtitle: "Giảm giá lên đến 50% cho tất cả sách",
    description:
      "Cơ hội tuyệt vời để sở hữu những cuốn sách hay với giá ưu đãi",
      img:  "https://static.vecteezy.com/system/resources/previews/021/916/224/non_2x/promo-banner-with-stack-of-books-globe-inkwell-quill-plant-lantern-ebook-world-book-day-bookstore-bookshop-library-book-lover-bibliophile-education-for-poster-cover-advertising-vector.jpg"
     ,
  },
  {
    title: "Sách Mới Về Kho",
    subtitle: "Hàng trăm đầu sách mới nhất 2024",
    description: "Cập nhật những cuốn sách hot nhất hiện tại",
    img: "https://fortbragglibrary.org/wp-content/uploads/2017/12/Book-banner.jpg",
  },
  {
    title: "Miễn Phí Vận Chuyển",
    subtitle: "Cho đơn hàng từ 200,000đ",
    description: "Giao hàng nhanh chóng trên toàn quốc",
    img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1600&h=600&fit=crop",
  },
];

  return (
    <Layout className="min-h-screen w-full bg-white">
      <Content>
        {/* Hero Banner */}
        {/* 🖼 Hero Banner với hình nền */}
        <div className="bg-white">
          <Carousel autoplay className="h-[480px] md:h-[520px] lg:h-[560px]">
            {bannerData.map((banner, index) => (
              <div key={index}>
                <div
                  className="relative flex items-center justify-center h-[480px] md:h-[520px] lg:h-[560px] text-white"
                  style={{
                    backgroundImage: `url(${banner.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >

                  {/* Nội dung banner */}
                  <div
                      className="
                        relative z-10 text-center px-6 max-w-3xl mx-auto
                        bg-white/50 backdrop-blur-md
                        rounded-2xl shadow-lg p-8
                      "
                    >
                    <Title
                      level={1}
                      className="text-white !mb-4 text-5xl font-bold drop-shadow-lg"
                    >
                      {banner.title}
                    </Title>
                    <Title
                      level={3}
                      className="text-white !mb-6 text-2xl font-semibold drop-shadow"
                    >
                      {banner.subtitle}
                    </Title>
                    <Paragraph className="text-white text-lg mb-8 drop-shadow-md max-w-2xl mx-auto">
                      {banner.description}
                    </Paragraph>
                    <Space size="middle">
                      <Button
                        size="large"
                        type="primary"
                        className="bg-black text-white border-white hover:bg-white hover:text-black px-8 py-6 h-auto text-base font-medium"
                      >
                        Mua ngay
                      </Button>
                      <Button
                        size="large"
                        className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 h-auto text-base font-medium"
                      >
                        Xem thêm
                      </Button>
                    </Space>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>


        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Categories Section - IMPROVED */}
          <div className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-16">
              <Title level={2} className="!text-black !mb-3 text-4xl font-bold">
                Khám Phá Theo Danh Mục
              </Title>
              <Paragraph className="text-gray-600 text-lg max-w-2xl mx-auto">
                Tìm kiếm cuốn sách yêu thích của bạn trong các danh mục đa dạng
              </Paragraph>
            </div>

            <Row gutter={[24, 24]} className="px-4">
              {categories.map((cat, index) => (
                <Col xs={12} sm={8} md={6} lg={3} key={index}>
                  <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(index)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div
                      className="bg-white rounded-2xl p-6 border-2 border-gray-100 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:border-transparent overflow-hidden"
                      style={{
                        borderColor:
                          hoveredCategory === index ? cat.color : undefined,
                      }}
                    >
                      {/* Background gradient on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${cat.color} 0%, transparent 100%)`,
                        }}
                      />

                      {/* Icon container */}
                      <div
                        className="relative w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor:
                            hoveredCategory === index ? cat.color : "#f5f5f5",
                          color:
                            hoveredCategory === index ? "white" : cat.color,
                        }}
                      >
                        {cat.icon}
                      </div>

                      {/* Category name */}
                      <Text className="block font-semibold text-base text-gray-800 mb-2 text-center">
                        {cat.name}
                      </Text>

                      {/* Book count */}
                      <div className="text-center"><Text className="text-sm text-gray-500">
                          {cat.count} cuốn
                        </Text>
                      </div>

                      {/* Hover arrow indicator */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span
                          className="text-xl font-bold"
                          style={{ color: cat.color }}
                        >
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* View all categories button */}
            <div className="text-center mt-12">
              <Button
                size="large"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-10 py-6 h-auto text-base font-medium rounded-full transition-all duration-300"
              >
                Xem Tất Cả Danh Mục →
              </Button>
            </div>
          </div>

          <div className="py-16">
            <Title level={2} className="text-center mb-12 text-black">
              Sách Mới
            </Title>

            {loadingBooks ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" tip="Đang tải sách nổi bật..." />
              </div>
            ) : (
              <div
                className="
                  grid gap-6
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                  2xl:grid-cols-6
                  px-2 sm:px-4 md:px-8
                "
              >
                {featuredBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </div>
          {
            recommendedBooks.length > 0 ? (
              <div className="py-16">
                <Title level={2} className="text-center mb-12 text-black">
                  Gợi ý cho bạn
                </Title>

                {loadingBooks ? (
                  <div className="flex justify-center items-center py-20">
                    <Spin size="large" tip="Đang tải sách nổi bật..." />
                  </div>
                ) : (
                  <div
                    className="
                      grid gap-6
                      grid-cols-1
                      sm:grid-cols-2
                      md:grid-cols-3
                      lg:grid-cols-4
                      xl:grid-cols-5
                      2xl:grid-cols-6
                      px-2 sm:px-4 md:px-8
                    "
                  >
                    {recommendedBooks.map((book) => (
                      <BookCard key={book._id} book={book} />
                    ))}
                  </div>
                )}
              </div>
            ) : <p className="text-gray-500 italic">
            Đăng nhập để xem gợi ý sách dành riêng cho bạn
          </p>
          }


          {/* Features Section */}
          <div className="py-16 bg-white -mx-4 lg:-mx-8 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Title level={2} className="text-center mb-12 text-black">
                Tại Sao Chọn Chúng Tôi?
              </Title>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                      <RocketOutlined />
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Giao Hàng Nhanh
                    </Title>
                    <Paragraph className="text-black">
                      Giao hàng trong 24h tại TP.HCM và Hà Nội. Miễn phí ship
                      cho đơn hàng trên 200,000đ.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                      <SafetyOutlined />
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Chất Lượng Đảm Bảo
                    </Title>
                    <Paragraph className="text-black">100% sách chính hãng, bảo hành đổi trả trong 7 ngày nếu có
                      lỗi từ nhà sản xuất.
                    </Paragraph>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl">
                      <DollarCircleOutlined />
                    </div>
                    <Title level={4} className="mb-4 text-black">
                      Giá Tốt Nhất
                    </Title>
                    <Paragraph className="text-black">
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
            <div className="bg-white text-black border border-black rounded-2xl p-12 text-center">
              <Title level={2} className="!text-black mb-4">
                Đăng Ký Nhận Tin
              </Title>
              <Paragraph className="text-black mb-8 max-w-2xl mx-auto">
                Nhận thông báo về sách mới, khuyến mãi đặc biệt và các sự kiện
                thú vị từ cửa hàng sách của chúng tôi.
              </Paragraph>
              <div className="flex max-w-md mx-auto">
                <Input
                  placeholder="Nhập email của bạn"
                  className="rounded-r-none border-black"
                  size="large"
                />
                <Button
                  type="primary"
                  size="large"
                  className="bg-black text-white border-black hover:bg-white hover:text-black rounded-l-none"
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="bg-white text-black border-t border-black">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} className="!text-black mb-4">
                BookStore
              </Title>
              <Paragraph className="text-black">
                Cửa hàng sách trực tuyến hàng đầu Việt Nam với hàng ngàn đầu
                sách chất lượng cao.
              </Paragraph>
            </Col>
            <Col xs={12} md={6}>
              <Title level={5} className="!text-black mb-4">
                Liên kết
              </Title>
              <div className="space-y-2">
                <div>
                  <a
                    href="#"className="text-black hover:text-black hover:underline"
                    >
                      Về chúng tôi
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Danh mục sách
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Khuyến mãi
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Blog
                    </a>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <Title level={5} className="!text-black mb-4">
                  Hỗ trợ
                </Title>
                <div className="space-y-2">
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Liên hệ
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Câu hỏi thường gặp
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Chính sách đổi trả
                    </a>
                  </div>
                  <div>
                    <a
                      href="#"
                      className="text-black hover:text-black hover:underline"
                    >
                      Hướng dẫn mua hàng
                    </a>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={6}>
                <Title level={5} className="!text-black mb-4">
                  Liên hệ
                </Title>
                <div className="space-y-2 text-black">
                  <div>📍 123 Đường ABC, Quận 1, TP.HCM</div>
                  <div>📞 (028) 1234 5678</div>
                  <div>✉️ hello@bookstore.vn</div>
                </div>
              </Col>
            </Row>
            <div className="border-t border-black mt-12 pt-8 text-center">
              <Text className="text-black">
                © 2024 BookStore. Tất cả quyền được bảo lưu.
              </Text>
            </div>
          </div>
        </Footer>
      </Layout>
    );
  };
  
  export default HomePage;