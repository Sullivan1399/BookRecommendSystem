import React, { useState, useEffect } from "react";
import { Card, Avatar, Form, Input, Button, DatePicker, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

import { updateProfile } from "../../api/profile";

const { TextArea } = Input;

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { user: initialUserData } = state || {};

  const [form] = Form.useForm();
  const [userData, setUserData] = useState(initialUserData || {});

  useEffect(() => {
    // keep local userData for avatar/title rendering
    setUserData(initialUserData || {});

    // prepare values for the form, convert dob to dayjs or null
    const formValues = {
      fullName: initialUserData?.fullName || "",
      email: initialUserData?.email || "",
      phone: initialUserData?.phone || "",
      address: initialUserData?.address || "",
      dob: null, // ensure DatePicker never receives an empty string
    };

    const dobValue = initialUserData?.dob;
    if (dobValue && dobValue !== "Chưa cập nhật") {
      // first try strict parse with expected format, then fallback to generic parse
      let parsed = dayjs(dobValue, "YYYY-MM-DD", true);
      if (!parsed.isValid()) {
        parsed = dayjs(dobValue); // fallback (ISO / timestamp)
      }
      if (parsed.isValid()) {
        formValues.dob = parsed;
      } else {
        console.warn("Invalid dob format, leaving as null:", dobValue);
      }
    }

    // set fields AFTER we've converted dob to dayjs or null
    form.setFieldsValue(formValues);
  }, [initialUserData, form]);

  const onFinish = async (values) => {
    try {
      const raw = localStorage.getItem("user");
      const userId = raw ? JSON.parse(raw).id : null;
      if (!userId) throw new Error("User ID not found");

      const profileData = {
        fullName: values.fullName || "",
        email: values.email || "",
        phone: values.phone || "",
        address: values.address || "",
        // send empty string if no dob (keeps same behavior you had); change to null if backend prefers null
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
      };

      await updateProfile(userId, profileData);
      message.success("Cập nhật hồ sơ thành công!");
      navigate("/info");
    } catch (error) {
      message.error(error?.message || "Cập nhật hồ sơ thất bại");
    }
  };

  const onCancel = () => {
    navigate("/info");
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
          </div>
        </div>
      </Card>

      <Card className="shadow-sm">
        {/* removed initialValues prop to avoid passing raw userData (string dob) to DatePicker */}
        <Form
          form={form}
          name="editProfile"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <TextArea rows={4} />
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
