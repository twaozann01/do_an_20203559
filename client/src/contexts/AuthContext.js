/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from "react";
import { getInfo } from "../services/Api"; // API lấy thông tin user
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// 1. Tạo context
export const AuthContext = createContext();

// 2. Provider để bọc toàn bộ app
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null); // Thông tin user
  const [loading, setLoading] = useState(true); // Đợi gọi API xong
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUserInfo(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT", decoded); // Giải mã để lấy userId
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        if (!userId) {
        console.error("Không tìm thấy userId trong token đã decode");
        setLoading(false);
        localStorage.removeItem("accessToken");
        navigate("/login");
        return;
      }

        const res = await getInfo(userId, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(res.data);
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        setUserInfo(null);
        localStorage.removeItem("accessToken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
