const BASE_URL = "http://127.0.0.1:8000/ratings";

async function handleResponse(res, apiName) {
  const contentType = res.headers.get("content-type");
  let data;

  try {
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
  } catch (err) {
    console.error(`[${apiName}] Lỗi khi parse response:`, err);
    throw new Error(`Lỗi phản hồi từ server (${apiName})`);
  }

  if (!res.ok) {
    console.groupCollapsed(`[${apiName}] Lỗi HTTP ${res.status}`);
    console.error("Response body:", data);
    console.groupEnd();
    throw new Error(
      typeof data === "string"
        ? `(${apiName}) ${data}`
        : `(${apiName}) ${data?.detail || "Yêu cầu thất bại"}`
    );
  }

  console.groupCollapsed(`[${apiName}] Thành công`);
  console.log("Status:", res.status);
  console.log("Data:", data);
  console.groupEnd();

  return data;
}

export const getRatingsForBook = async (isbn) => {
  const apiName = `GET /ratings/book/${isbn}`;
  console.group(`Gọi API: ${apiName}`);

  try {
    const res = await fetch(`${BASE_URL}/book/${isbn}`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const data = await handleResponse(res, apiName);
    console.groupEnd();
    return data;
  } catch (error) {
    console.error(`[${apiName}]`, error.message);
    console.groupEnd();
    throw error;
  }
};

export const getAverageRating = async (isbn) => {
  const apiName = `GET /ratings/book/${isbn}/avg`;
  console.group(`Gọi API: ${apiName}`);

  try {
    const res = await fetch(`${BASE_URL}/book/${isbn}/avg`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const data = await handleResponse(res, apiName);
    console.groupEnd();
    return data;
  } catch (error) {
    console.error(`[${apiName}]`, error.message);
    console.groupEnd();
    throw error;
  }
};

export const submitRating = async (token, payload) => {
  const apiName = `POST /ratings/`;
  console.group(`Gọi API: ${apiName}`);
  console.log("Payload:", payload);

  try {
    const res = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(res, apiName);
    console.groupEnd();
    return data;
  } catch (error) {
    console.error(`[${apiName}]`, error.message);
    console.groupEnd();

    // Phân loại lỗi rõ ràng
    if (error.message.includes("401")) {
      throw new Error("401: Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    } else if (error.message.includes("403")) {
      throw new Error("403: Bạn không có quyền thực hiện hành động này.");
    } else if (error.message.includes("NetworkError")) {
      throw new Error("Mất kết nối đến server. Kiểm tra mạng của bạn.");
    } else {
      throw new Error(error.message || "Lỗi không xác định khi gửi rating.");
    }
  }
};
