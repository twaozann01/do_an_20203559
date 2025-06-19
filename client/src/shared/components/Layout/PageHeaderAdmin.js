import React from "react";
import { useLocation, Link } from "react-router-dom";

const routeTitles = {
  "/admin/list-apointment": "Đơn hàng",
  "/admin/list-repair": "Kỹ thuật viên",
  "/admin/list-customer": "Người dùng",
  "/admin/list-service": "Dịch vụ",
  "/admin/gift": "Khuyến mãi & Ưu đãi",
  "/admin/form-register": "Đơn đăng ký",
  "/admin/calender": "Lịch",
  "/admin/chat": "Chat",
  "/admin/ratting": "Đánh giá",
  "/admin/payment": "Thanh toán",
  "/admin/report": "Báo cáo & Thống kê",
  "/admin/setting": "Cài đặt hệ thống",
  "/admin/profile": "Hồ sơ",
  "/admin/add-service": "Thêm dịch vụ",
};

const PageHeaderAdmin = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageTitle = routeTitles[currentPath] || "Không có thông tin";

  return (
    <div className="page-header">
      <div className="row">
        <div className="col-sm-12">
          <h3 className="page-title">{pageTitle}</h3>
          <ul className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin">Bảng điều khiển</Link>
            </li>
            <li className="breadcrumb-item active">{pageTitle}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageHeaderAdmin;
