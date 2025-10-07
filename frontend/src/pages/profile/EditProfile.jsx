import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProfile } from "../../api/profile";

const { Option } = Select;

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { user: initialUserData } = state || {};

  const [form] = Form.useForm();
  const [userData, setUserData] = useState(initialUserData || {});

  useEffect(() => {
    setUserData(initialUserData || {});

    // ✅ Gán giá trị ban đầu vào form
    form.setFieldsValue({
      fullName: initialUserData?.fullName || "",
      age: initialUserData?.age || "",
      gender: initialUserData?.gender || "khác",
    });
  }, [initialUserData, form]);

  const onFinish = async (values) => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : {};
      const userId = parsed._id || parsed.id;
      if (!userId) throw new Error("User ID not found");

      const profileData = {
        fullName: values.fullName,
        age: Number(values.age),
        gender: values.gender,
      };

      await updateProfile(userId, profileData);
      message.success("Cập nhật hồ sơ thành công!");
      navigate("/profile");
    } catch (error) {
      message.error(error?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const onCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-sm">
        <div className="flex items-center gap-6">
          <Avatar
            size={100}
            src={userData.avatar || "https://i.pravatar.cc/150?img=3"}
          />
          <div>
            <h2 className="text-2xl font-bold text-black">Chỉnh sửa hồ sơ</h2>
            <p className="text-gray-500">{userData.username}</p>
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        <Form form={form} name="editProfile" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Tuổi"
            rules={[
              { required: true, message: "Vui lòng nhập tuổi!" },
              { type: "number", min: 1, max: 100, message: "Tuổi không hợp lệ!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="nam">Nam</Option>
              <Option value="nữ">Nữ</Option>
              <Option value="khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-black text-white mr-2"
            >
              Lưu thay đổi
            </Button>
            <Button
              type="default"
              onClick={onCancel}
              className="border-black text-black"
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
