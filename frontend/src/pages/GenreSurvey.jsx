import React, { useState } from "react";
import { Layout, Card, Typography, Button, Progress, message } from "antd";

const { Title, Text } = Typography;
const { Content } = Layout;

const GenreSurvey = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    {
      id: 1,
      name: "Kỹ năng sống",
      description: "Phát triển bản thân và kỹ năng cá nhân",
      books: ["Đắc Nhân Tâm", "7 Thói Quen Hiệu Quả", "Atomic Habits"],
    },
    {
      id: 2,
      name: "Tâm lý học",
      description: "Hiểu biết về tâm lý và hành vi con người",
      books: [
        "Thinking Fast & Slow",
        "The Psychology of Persuasion",
        "Mindset",
      ],
    },
    {
      id: 3,
      name: "Kinh doanh",
      description: "Quản trị, khởi nghiệp và phát triển doanh nghiệp",
      books: ["The Lean Startup", "Good to Great", "Zero to One"],
    },
    {
      id: 4,
      name: "Lịch sử",
      description: "Khám phá quá khứ và những bài học từ lịch sử",
      books: ["Sapiens", "21 Lessons for 21st Century", "The Art of War"],
    },
    {
      id: 5,
      name: "Khoa học viễn tưởng",
      description: "Thế giới tương lai và công nghệ",
      books: ["Dune", "Foundation", "The Martian"],
    },
    {
      id: 6,
      name: "Văn học cổ điển",
      description: "Những tác phẩm kinh điển của nhân loại",
      books: ["1984", "To Kill a Mockingbird", "Pride and Prejudice"],
    },
    {
      id: 7,
      name: "Triết học",
      description: "Tư duy và triết lý sống",
      books: ["Meditations", "The Republic", "Thus Spoke Zarathustra"],
    },
    {
      id: 8,
      name: "Tiểu thuyết hiện đại",
      description: "Những câu chuyện đương đại hấp dẫn",
      books: ["The Great Gatsby", "Norwegian Wood", "The Kite Runner"],
    },
    {
      id: 9,
      name: "Khoa học tự nhiên",
      description: "Khám phá thế giới tự nhiên và vũ trụ",
      books: ["A Brief History of Time", "Cosmos", "The Origin of Species"],
    },
    {
      id: 10,
      name: "Thể thao & Sức khỏe",
      description: "Rèn luyện thể chất và chăm sóc sức khỏe",
      books: ["Born to Run", "The 4-Hour Body", "Atomic Habits"],
    },
    {
      id: 11,
      name: "Nghệ thuật & Thiết kế",
      description: "Thẩm mỹ, sáng tạo và nghệ thuật",
      books: [
        "The Art Book",
        "Ways of Seeing",
        "The Design of Everyday Things",
      ],
    },
    {
      id: 12,
      name: "Du lịch & Khám phá",
      description: "Khám phá thế giới và văn hóa các nước",
      books: ["Into the Wild", "A Walk in the Woods", "The Geography of Bliss"],
    },
  ];

  const handleGenreSelect = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      if (selectedGenres.length < 8) {
        setSelectedGenres([...selectedGenres, genreId]);
      } else {
        message.warning("Bạn chỉ có thể chọn tối đa 8 thể loại");
      }
    }
  };

  const handleNext = () => {
    if (selectedGenres.length < 3) {
      message.warning("Vui lòng chọn ít nhất 3 thể loại để tiếp tục");
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      message.success(
        "Cảm ơn bạn đã hoàn thành khảo sát! Chúng tôi sẽ gợi ý những cuốn sách phù hợp với sở thích của bạn."
      );
      setIsSubmitting(false);
      // Redirect to main dashboard or home page
    }, 2000);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const progress = currentStep === 1 ? 50 : 100;

  if (currentStep === 2) {
    return (
      <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Content className="flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
              <div className="text-center p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <Text className="text-white font-bold text-lg">✓</Text>
                    </div>
                  </div>
                  <Title level={2} className="text-gray-900 mb-2">
                    Xác Nhận Lựa Chọn
                  </Title>
                  <Text className="text-gray-600 text-lg">
                    Bạn đã chọn {selectedGenres.length} thể loại yêu thích
                  </Text>
                </div>

                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGenres.map((genreId) => {
                      const genre = genres.find((g) => g.id === genreId);
                      return (
                        <div
                          key={genreId}
                          className="bg-gray-50 rounded-xl p-4 text-left"
                        >
                          <Text className="font-semibold text-gray-900 block mb-1">
                            {genre.name}
                          </Text>
                          <Text className="text-gray-600 text-sm">
                            {genre.description}
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    size="large"
                    onClick={handleBack}
                    className="px-8 h-12 rounded-lg font-medium"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    className="bg-black hover:bg-gray-800 border-black px-8 h-12 rounded-lg font-medium"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Hoàn thành khảo sát"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Content className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <Title
                level={1}
                className="text-gray-900 mb-4 text-3xl lg:text-4xl font-bold"
              >
                Chào mừng bạn đến với thư viện số!
              </Title>
              <Text className="text-gray-600 text-lg lg:text-xl block mb-6">
                Để có trải nghiệm tốt nhất, hãy cho chúng tôi biết những thể
                loại sách bạn yêu thích
              </Text>

              {/* Progress */}
              <div className="max-w-md mx-auto mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Text className="text-sm text-gray-600">
                    Tiến độ khảo sát
                  </Text>
                  <Text className="text-sm font-medium text-gray-800">
                    {progress}%
                  </Text>
                </div>
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor="#000"
                  trailColor="#f3f4f6"
                  className="mb-2"
                />
                <Text className="text-xs text-gray-500">
                  Chọn ít nhất 3 thể loại, tối đa 8 thể loại
                </Text>
              </div>
            </div>
          </div>

          {/* Selection Info */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg border border-gray-100">
              <Text className="text-gray-600 mr-2">Đã chọn:</Text>
              <div className="flex items-center">
                <Text className="font-bold text-xl text-gray-900 mr-1">
                  {selectedGenres.length}
                </Text>
                <Text className="text-gray-500">/8 thể loại</Text>
              </div>
            </div>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {genres.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id);
              return (
                <Card
                  key={genre.id}
                  className={`cursor-pointer transition-all duration-300 border-2 rounded-xl hover:shadow-xl transform hover:scale-105 ${
                    isSelected
                      ? "border-black bg-black text-white shadow-xl scale-105"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                  bodyStyle={{ padding: "24px" }}
                  onClick={() => handleGenreSelect(genre.id)}
                >
                  <div className="text-center">
                    <Title
                      level={4}
                      className={`mb-3 font-bold ${
                        isSelected ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {genre.name}
                    </Title>
                    <Text
                      className={`block mb-4 leading-relaxed ${
                        isSelected ? "text-gray-200" : "text-gray-600"
                      }`}
                    >
                      {genre.description}
                    </Text>

                    {/* Sample books */}
                    <div className="space-y-1">
                      <Text
                        className={`text-xs font-medium uppercase tracking-wide ${
                          isSelected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Sách tiêu biểu:
                      </Text>
                      {genre.books.slice(0, 2).map((book, index) => (
                        <Text
                          key={index}
                          className={`block text-sm ${
                            isSelected ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          • {book}
                        </Text>
                      ))}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Text className="text-black font-bold text-sm">✓</Text>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 inline-block">
              <div className="mb-4">
                <Text className="text-gray-600 block mb-2">
                  {selectedGenres.length >= 3
                    ? `Tuyệt vời! Bạn đã chọn ${selectedGenres.length} thể loại`
                    : `Vui lòng chọn thêm ${
                        3 - selectedGenres.length
                      } thể loại nữa`}
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                disabled={selectedGenres.length < 3}
                onClick={handleNext}
                className={`px-12 h-14 rounded-xl font-semibold text-lg ${
                  selectedGenres.length >= 3
                    ? "bg-black hover:bg-gray-800 border-black"
                    : "bg-gray-400 border-gray-400"
                }`}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default GenreSurvey;
