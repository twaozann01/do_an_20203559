/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      {/* Sidebar */}
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              <li className="menu-title">
                <span>Danh mục</span>
              </li>

              <li className={currentPath === '/admin' ? 'active' : ''}>
                <Link to="/admin"><i className="fas fa-home" /> <span>Bảng điều khiển</span></Link>
              </li>

              <li className={currentPath === '/admin/list-apointment' ? 'active' : ''}>
                <Link to="/admin/list-apointment"><i className="fas fa-calendar-check" /> <span>Đơn đặt hẹn</span></Link>
              </li>

              <li className={currentPath === '/admin/list-repair' ? 'active' : ''}>
                <Link to="/admin/list-repair"><i className="fas fa-user-nurse" /><span>Kỹ thuật viên</span></Link>
              </li>

              <li className={currentPath === '/admin/list-customer' ? 'active' : ''}>
                <Link to="/admin/list-customer"><i className="fas fa-user" /><span>Người dùng</span></Link>
              </li>

              <li className={currentPath === '/admin/list-service' ? 'active' : ''}>
                <Link to="/admin/list-service"><i className="fas fa-tasks" /> <span>Dịch vụ</span></Link>
              </li>

              <li className={currentPath === '/admin/gift' ? 'active' : ''}>
                <Link to="/admin/gift"><i className="fas fa-gift" /> <span>Khuyến mãi &amp; Ưu đãi</span></Link>
              </li>

              <li className={currentPath === '/admin/form-register' ? 'active' : ''}>
                <Link to="/admin/form-register"><i className="fas fa-user-plus" /> <span>Đơn đăng ký</span> <span className="order-qty">(2)</span></Link>
              </li>

              <li className={currentPath === '/admin/calender' ? 'active' : ''}>
                <Link to="/admin/calender"><i className="fas fa-calendar-alt" /><span>Lịch</span></Link>
              </li>

              <li className={currentPath === '/admin/chat' ? 'active' : ''}>
                <Link to="/admin/chat"><i className="fas fa-comment-dots" /> <span>Chat</span></Link>
              </li>

              <li className={currentPath === '/admin/ratting' ? 'active' : ''}>
                <Link to="/admin/ratting"><i className="fas fa-star" /><span>Đánh giá</span></Link>
              </li>

              <li className={currentPath === '/admin/payment' ? 'active' : ''}>
                <Link to="/admin/payment"><i className="fab fa-paypal" /> <span>Thanh toán</span></Link>
              </li>

              <li className={currentPath === '/admin/report' ? 'active' : ''}>
                <Link to="/admin/report"><i className="fas fa-chart-line" /> <span>Báo cáo &amp; Thống kê</span></Link>
              </li>

              <li className={currentPath === '/admin/setting' ? 'active' : ''}>
                <Link to="/admin/setting"><i className="fas fa-cogs" /><span>Cài đặt hệ thống</span></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* /Sidebar */}
    </div>
  );
};

export default SidebarAdmin;
