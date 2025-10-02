const API_URL = "http://127.0.0.1:8000/books";
const TOKEN = localStorage.getItem("accesstoken");

const request = async (URL, options = {}) => {
    const res = await fetch(URL, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
            ...options.headers,
        },
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
}

export const getBooks = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Không thể lấy danh sách sách");
      }
  
      const data = await response.json();
  
      // Chuẩn hóa dữ liệu (nếu cần)
      return data.map((book) => ({
        ISBN: book.ISBN,
        "Book-Title": book["Book-Title"],
        "Book-Author": book["Book-Author"],
        "Year-Of-Publication": book["Year-Of-Publication"],
        Publisher: book.Publisher,
        Category: book.Category,
        "Image-URL-L": book["Image-URL-L"],
        "Image-URL-M": book["Image-URL-M"],
        "Image-URL-S": book["Image-URL-S"],
        _id: book._id,
      }));
    } catch (error) {
      console.error("Error fetching books:", error.message);
      throw error;
    }
  };

export const addFavoriteBook = async (userId, bookId) => {
    try {
        const url = `${API_URL}/users/${userId}/favorites/${bookId}`;
        const res = await request(url, {
            method: "POST",
        });
        return res;
    }
    catch (error) {
        console.error("Error adding favorite book:", error);
        throw error;
    }
}

export const insertBook = async (bookData) => {
    try {
      const token = localStorage.getItem("access_token"); // lấy token đã login
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, msg: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error inserting book:", error);
      throw error;
    }
};

export const updateBook = async (bookId, bookData) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");
  
      const url = `${API_URL}/${bookId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "accept": "application/json",
          "Authorization": `Bearer ${token}`,  // thêm Bearer token
        },
        body: JSON.stringify(bookData),
      });
  
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Update thất bại (status ${response.status})`);
      }

      return await response.json(); // backend trả về object book đã update
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
};

export const deleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem("access_token"); // lấy token đã login
      if (!token) throw new Error("Chưa đăng nhập hoặc thiếu token");
  
      const url = `${API_URL}/${bookId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${token}`, // thêm Bearer token
        },
      });
  
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || `Xóa thất bại (status ${response.status})`);
      }
  
      return await response.json(); // backend có thể trả message success
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  };

  export const searchBooks = async (query, k = 5) => {
    try {
      const url = `${API_URL}/search?query=${encodeURIComponent(query)}&k=${k}`;
      const data = await request(url);
  
      const results = Array.isArray(data) ? data : [data];
  
      return results.map(book => ({
        _id: book._id,
        ISBN: book.ISBN || "",
        "Book-Title": book["Book-Title"] || "",
        "Book-Author": book["Book-Author"] || "",
        "Year-Of-Publication": book["Year-Of-Publication"] || "",
        Publisher: book.Publisher || "",
        Category: book.Category || "",
        "Image-URL-L": book["Image-URL-L"] || "https://via.placeholder.com/150",
        score: book.score || null,
      }));
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    }
  };
  
  