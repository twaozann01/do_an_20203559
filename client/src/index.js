import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// ✅ CSS dùng chung
import "./assets/css/bootstrap.min.css";
import "./assets/plugins/fontawesome/css/fontawesome.min.css";
import "./assets/plugins/fontawesome/css/all.min.css";
import "./assets/css/feathericon.min.css";
import "./assets/css/bootstrap-datetimepicker.min.css";
import "./assets/css/owl.carousel.min.css";
import { CartProvider } from "./contexts/CartContext";

// ✅ Load CSS theo vai trò
const token = localStorage.getItem("accessToken");
if (token) {
  try {
    const { jwtDecode } = require("jwt-decode");
    const decoded = jwtDecode(token);
    const role =
      decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ];

    switch (role) {
      case "Admin":
        require("./assets/css/admin.css");
        break;
      default:
        require("./assets/css/custom.css"); // Mặc định cho user thường
    }
  } catch (error) {
    console.error("Không thể decode JWT để load CSS:", error);
    require("./assets/css/custom.css"); // Fallback
  }
} else {
  require("./assets/css/custom.css"); // Chưa đăng nhập → dùng CSS mặc định
}

// ✅ Mount App
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
        <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
