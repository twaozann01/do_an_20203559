/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useContext } from "react";
import { avt, logo } from "../../../assets/img/banner";
import { user_1, user_2 } from "../../../assets/img/user";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";

const HeaderAdmin = () => {
  const {userInfo, logout} = useContext(AuthContext)
  const [showNoti, setShowNoti] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: "Hoàng Sơn",
      message: "đã gửi yêu cầu sửa chữa",
      time: "4 phút trước",
      avatar: user_1,
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      message: "đã hoàn tất đơn hàng",
      time: "10 phút trước",
      avatar: user_2,
    },
    {
      id: 3,
      name: "Lê Minh",
      message: "đã cập nhật trạng thái đơn",
      time: "30 phút trước",
      avatar: user_1,
    },
  ]);

  const notiRef = useRef(null);
  const userMenuRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!notiRef.current?.contains(e.target)) setShowNoti(false);
      if (!userMenuRef.current?.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left">
          <a href="admin.html" className="logo">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        {/* /Logo */}

        <div className="top-nav-search">
          <form>
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm"
            />
            <button className="btn" type="submit">
              <i className="fa fa-search" />
            </button>
          </form>
        </div>

        {/* Header Right Menu */}
        <ul className="nav user-menu">
          {/* Notifications */}
          <li className="nav-item dropdown noti-dropdown position-relative">
            <a
              href="#"
              className="dropdown-toggle nav-link"
              onClick={() => {
                setShowNoti(!showNoti);
                setShowUserMenu(false);
              }}
            >
              <i className="far fa-bell text-black"></i>
              <span className="badge rounded-pill">{notifications.length}</span>
            </a>
            {showNoti && (
              <div
                className="dropdown-menu notifications position-absolute end-0 shadow show"
                ref={notiRef}
              >
                <div className="topnav-dropdown-header d-flex justify-content-between px-3 py-2">
                  <span className="notification-title">Thông báo</span>
                  <a
                    href="#"
                    className="clear-noti"
                    onClick={(e) => {
                      e.preventDefault();
                      setNotifications([]); // Xóa toàn bộ thông báo
                    }}
                  >
                    Xóa thông báo
                  </a>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    {notifications.length === 0 ? (
                      <li className="text-center text-muted p-3">
                        Không có thông báo nào
                      </li>
                    ) : (
                      notifications.map((item) => (
                        <li key={item.id} className="notification-message">
                          <a href="#">
                            <div className="notify-block d-flex">
                              <span className="avatar avatar-sm flex-shrink-0 me-2">
                                <img
                                  className="avatar-img rounded-circle"
                                  alt="User"
                                  src={item.avatar}
                                />
                              </span>
                              <div className="media-body flex-grow-1">
                                <p className="noti-details mb-1">
                                  <span className="noti-title">
                                    {item.name}
                                  </span>{" "}
                                  {item.message}
                                </p>
                                <p className="noti-time mb-0">
                                  <span className="notification-time">
                                    {item.time}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="topnav-dropdown-footer text-center">
                  <a href="#">Xem tất cả thông báo</a>
                </div>
              </div>
            )}
          </li>
          {/* /Notifications */}

          {/* User Menu */}
          <li className="nav-item dropdown has-arrow position-relative">
            <a
              href="#"
              className="dropdown-toggle nav-link"
              onClick={() => {
                setShowNoti(false);
                setShowUserMenu(!showUserMenu);
              }}
            >
              <span className="user-img">
                <img
                  className="rounded-circle"
                  src={userInfo?.data.avatar || avt}
                  width={31}
                  alt={userInfo?.data.fullName || "Avatar"}
                />
              </span>
            </a>
            {showUserMenu && (
              <div
                className="dropdown-menu position-absolute end-0 shadow show"
                ref={userMenuRef}
              >
                <div className="user-header">
                  <div className="avatar avatar-sm">
                    <img
                      src={userInfo?.data.avatar || avt}
                      alt="User Image"
                      className="avatar-img rounded-circle"
                    />
                  </div>
                  <div className="user-text">
                    <h6>{userInfo?.data.fullName}</h6>
                    <p className="text-muted mb-0">{userInfo?.data.role === "Admin" ? "Quản trị viên" : ""}</p>
                  </div>
                </div>
                <Link className="dropdown-item text-black" to="/admin/profile">
                  Hồ sơ của bạn
                </Link>
                <Link className="dropdown-item text-black" to="/admin/setting">
                  Cài đặt
                </Link>
                <a className="dropdown-item text-black" onClick={logout}>
                  Đăng xuất
                </a>
              </div>
            )}
          </li>
          {/* /User Menu */}
        </ul>
        {/* /Header Right Menu */}
      </div>
      {/* /Header */}
    </div>
  );
};

export default HeaderAdmin;
