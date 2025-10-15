const API_URL = "http://127.0.0.1:8000"; // base URL backend

export const getFavoriteBooks = async (page = 1, limit = 9) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");

    const response = await fetch(
      `${API_URL}/favorites/book/me?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Nếu token hết hạn hoặc bị lỗi quyền
    if (response.status === 401) {
      throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    }

    // ✅ Kiểm tra lỗi chung
    if (!response.ok) {
      let errMsg = `Lỗi API (status ${response.status})`;
      try {
        const errData = await response.json();
        errMsg = errData.detail || errMsg;
      } catch (_) {}
      throw new Error(errMsg);
    }

    // ✅ Parse dữ liệu trả về
    const data = await response.json();

    /**
     * Trường hợp 1: Backend trả { items: [...], total: N }
     * Trường hợp 2: Backend trả thẳng mảng [...favoriteBooks]
     */
    const books = Array.isArray(data)
      ? data
      : Array.isArray(data.items)
      ? data.items
      : [];

    // ✅ Chuẩn hóa dữ liệu trước khi trả ra
    return books.map((book) => ({
      _id: book._id || book.book_id || null,
      ISBN: book.ISBN || "",
      "Book-Title": book["Book-Title"] || book.title || "",
      "Book-Author": book["Book-Author"] || book.author || "",
      "Year-Of-Publication": book["Year-Of-Publication"] || book.year || "",
      Publisher: book.Publisher || book.publisher || "",
      Category: book.Category || book.category || "",
      Description: book.Description || book.description || "",
      "Image-URL-S": book["Image-URL-S"] || book.image_small || "",
      "Image-URL-M": book["Image-URL-M"] || book.image_medium || "",
      "Image-URL-L": book["Image-URL-L"] || book.image_large || "",
    }));
  } catch (error) {
    console.error("❌ Error fetching favorite books:", error);
    throw error;
  }
};

export const addFavoriteBook = async (bookId) => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");

  const url = `${API_URL}/favorites/book/?book_id=${encodeURIComponent(bookId)}`;
  console.log("Thêm sách yêu thích:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  // Kiểm tra phản hồi
  if (!response.ok) {
    let errMsg = `Lỗi API (status ${response.status})`;
    try {
      const err = await response.json();
      errMsg = err.detail || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  // Trả JSON
  const result = await response.json();
  console.log("Thêm thành công:", result);
  return result;
};


export const removeFavoriteBook = async (bookId) => {
  console.log("bookId: " +bookId);
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");

  const response = await fetch(`${API_URL}/favorites/book/?book_id=${bookId}`, {
    method: "DELETE",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Lỗi API xóa (status ${response.status})`);
  }
  console.log("đã xóa khỏi danh sách yêu thích")
  return response.json();
};

export const addFavoriteGenre = async (userId, genre) => {
  let result = {
    success: false,
    status_code: null,
    detail: "",
    data: null,
  };

  try {
    const res = await fetch(`${API_URL}/favorites/genres/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ user_id: userId, genre }),
    });

    const text = await res.text();
    console.log("res:", text);
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }

    // ✅ Nếu thành công
    if (res.ok) {
      result.success = true;
      result.status_code = res.status;
      result.data = data;
      result.detail = "Thêm thể loại thành công.";
      return result;
    }

    // ✅ Nếu lỗi 400 hoặc duplicate
    const rawDetail =
      data?.detail || text || "Không thể thêm thể loại yêu thích";
    const isDuplicate =
      res.status === 400 ||
      rawDetail.toLowerCase().includes("đã có trong danh sách yêu thích");

    result.status_code = res.status;
    result.detail = rawDetail;
    result.isDuplicate = isDuplicate;
    return result; // ⚠️ Không throw nữa
  } catch (error) {
    // ✅ Nếu là lỗi mạng / backend down
    if (error.message.includes("Failed to fetch")) {
      result.status_code = 0;
      result.detail =
        "Không thể kết nối đến máy chủ. Hãy kiểm tra lại backend hoặc CORS.";
    } else {
      result.status_code = 500;
      result.detail = error.message || "Lỗi không xác định.";
    }
    
    return result;
  }
};


export const getFavoriteGenres = async (page = 1, limit = 10) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Chưa đăng nhập!");

    const res = await fetch(
      `${API_URL}/favorites/genres/me?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.detail || "Không thể lấy danh sách thể loại");
    }

    return data;
  } catch (error) {
    console.error("Error fetching genres:", error.message);
    throw error;
  }
};
export const removeFavoriteGenre = async (genre) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");

    const encodedGenre = encodeURIComponent(genre);
    const url = `${API_URL}/favorites/genres/?genre=${encodedGenre}`;
    console.log("🗑️ Xóa thể loại yêu thích:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Nếu token hết hạn
    if (response.status === 401) {
      throw new Error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    }

    // ✅ Kiểm tra lỗi chung
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.detail || `Lỗi API xóa (status ${response.status})`
      );
    }

    // ✅ Trả kết quả (thường là message hoặc object)
    const result = await response.json().catch(() => ({}));
    console.log("✅ Đã xóa thể loại yêu thích:", genre);
    return result;
  } catch (error) {
    throw error;
  }
};

