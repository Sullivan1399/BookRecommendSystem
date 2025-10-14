import { Breadcrumb, Layout, theme } from "antd";
import HeaderNavbar from "../components/Header";
import { Outlet, useLocation, Link } from "react-router-dom";
import ChatbotFloatButton from "../components/ChatbotFloatButton";
const HomePageLayout = () => {
  const location = useLocation();

  const path = location.pathname.split("/").filter((path) => path);

  const breadcrumbMap = {
    "": "TRANG CHỦ",
    calculate: "TÍNH TOÁN BMI, BMR. TDEE",
    "personal-profile": "HỒ SƠ CÁ NHÂN",
    "medical-records": "HỒ SƠ Y TẾ",
    "medical-history": "LỊCH SỬ KHÁM BỆNH",
    "regulation-use": "QUY ĐỊNH SỬ DỤNG",
    "terms-service": "ĐIỀU KHOẢN DỊCH VỤ",
    "service-list": "DANH SÁCH DỊCH VỤ",
    "notification-event": "THÔNG BÁO & SỰ KIỆN",
    booking: "KHÁM THEO CHUYÊN KHOA",
    "completed-booking": "LỊCH KHÁM ĐÃ HOÀN TẤT",
  };

  const breadcumbItems = [
    {
      title: <Link to="/">TRANG CHỦ</Link>,
    },
    ...path.map((item, index) => ({
      title: (
        <Link to={`/${path.slice(0, index + 1).join("/")}`}>
          {breadcrumbMap[item] || item}
        </Link>
      ),
    })),
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <HeaderNavbar />
      <div
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
          items={breadcumbItems}
        />
        <Layout
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: "screen",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/* <SideBar/> */}
          <Outlet />
          <ChatbotFloatButton /> {/* Nút chatbot xuất hiện ở mọi trang */}
        </Layout>
      </div>
    </Layout>
  );
};
export default HomePageLayout;
