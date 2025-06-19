// src/components/PageHeader.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const pageTitleMappings = [
  { pattern: /^\/$/, title: "Trang chủ" },
  { pattern: /^\/services$/, title: "Dịch vụ" },
  { pattern: /^\/services-grid$/, title: "Dịch vụ" },
  { pattern: /^\/book-orders$/, title: "Đặt lịch hẹn" },
  { pattern: /^\/find-orders$/, title: "Tìm đơn sửa chữa" },
  { pattern: /^\/create-blog$/, title: "Tạo bài viết" },
  { pattern: /^\/new-blog$/, title: "Bài viết mới" },
  { pattern: /^\/blog-detail$/, title: "Bài viết" },
  { pattern: /^\/support$/, title: "Hỗ trợ" },
  { pattern: /^\/cart$/, title: "Giỏ hàng" },
  { pattern: /^\/login$/, title: "Đăng nhập" },
  { pattern: /^\/register$/, title: "Đăng ký" },
  { pattern: /^\/forgot-password$/, title: "Khôi phục mật khẩu" },
  { pattern: /^\/verify-code$/, title: "Đổi mật khẩu" },
  { pattern: /^\/user$/, title: "Bảng điều khiển" },
  { pattern: /^\/user\/profile$/, title: "Hồ sơ" },
  { pattern: /^\/user\/form-register$/, title: "Đăng ký KTV" },
  { pattern: /^\/user\/chat$/, title: "Trò chuyện" },
  { pattern: /^\/user\/address$/, title: "Địa chỉ" },
  { pattern: /^\/user\/add-address$/, title: "Thêm địa chỉ" },
  { pattern: /^\/user\/edit-address\/.*$/, title: "Chỉnh sửa địa chỉ" },
  { pattern: /^\/user\/ordered$/, title: "Quản lý đơn hàng" },
  { pattern: /^\/user\/order-detail\/.*$/, title: "Chi tiết đơn hàng" },
  { pattern: /^\/user\/ratting$/, title: "Đánh giá" },
  { pattern: /^\/user\/ratting-detail.*$/, title: "Đánh giá đơn hàng" },
  { pattern: /^\/user\/setting-profile$/, title: "Chỉnh sửa hồ sơ" },
  { pattern: /^\/user\/change-password$/, title: "Đổi mật khẩu" },
  { pattern: /^\/user\/order-detail$/, title: "Chi tiết đơn hàng" },
  { pattern: /^\/user\/payment-detail$/, title: "Thanh toán" },
  { pattern: /^\/user\/payment.*$/, title: "Thanh toán" },
  { pattern: /^\/user\/create-blog$/, title: "Tạo bài viết" },
  { pattern: /^\/user\/blog-posted$/, title: "Bài viết đã đăng" },
  { pattern: /^\/user\/blog-pending$/, title: "Bài viết chờ duyệt" },
];

const PageHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  const resolveTitle = (path) => {
    for (const item of pageTitleMappings) {
      if (item.pattern.test(path)) return item.title;
    }
    return "Trang không xác định";
  };

  const title = resolveTitle(path);

  return (
    <div className="breadcrumb-bar-two">
      <div className="container">
        <div className="row align-items-center inner-banner">
          <div className="col-md-12 col-12 text-center">
            <h2 className="breadcrumb-title">{title}</h2>
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
