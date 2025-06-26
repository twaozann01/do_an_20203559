/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { getInfo, getAddress, getOrders } from "../../../services/Api";
import { getImage } from "../../utils/getImage";
import { AuthContext } from "../../../contexts/AuthContext";
import { avt } from "../../../assets/img/banner";

const SidebarCustomer = () => {
  const { userInfo, loading, logout } = useContext(AuthContext);
  const [user, setUser] = useState([]);
  const [order, setOrder] = useState([]);
  const [mainAddress, setMainAddress] = useState(null);
  const id = userInfo?.data.id
  // console.log(id)

  useEffect(() => {
    if (loading || !userInfo || !id) return;
    const fetchData = async () => {
      try {
        const [userRes, addressRes] = await Promise.all([
          getInfo(id),
          getAddress(id),
        ]);

        setUser(userRes.data.data);
        // console.log("Hồ sơ",userRes.data.data)

        const defaultAddress = addressRes.data.data.find((a) => a.addressMain);
        setMainAddress(defaultAddress);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu hồ sơ hoặc địa chỉ:", error);
      }
    };
    fetchData();
  }, [loading, userInfo]);
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (!userInfo) return;
    getOrders({
      params: {
        customerId: id,
      },
    })
      .then((res) => setOrder(res.data.data.items))
      .catch((error) => console.log("Lỗi khi lấy đơn hàng", error));
  }, [id]);

  return (
    <div className="profile-sidebar">
      <div className="widget-profile pro-widget-content">
        <div className="profile-info-widget">
          <a href="#" className="booking-doc-img">
            <img
              src={!user?.avatar ? avt : getImage(user?.avatar)}
              alt="User Image"
            />
          </a>
          <div className="profile-det-info">
            <h3>{user?.fullName}</h3>
            <div className="patient-details">
              <h5>
                <i className="fas fa-user" />{" "}
                {user?.role === "Repairman" ? "Thợ sửa chữa" : "Khách hàng"}
              </h5>
              <h5 className="mb-0">
                <i className="fas fa-map-marker-alt" /> {mainAddress?.city}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-widget">
        <nav className="dashboard-menu">
          <ul>
            {/* Các thẻ điều hướng */}
            <li className={path === "/user" ? "active" : ""}>
              <NavLink to="/user">
                <i className="fas fa-columns" />
                <span>Bảng điều khiển</span>
              </NavLink>
            </li>
            <li className={path === "/user/profile" ? "active" : ""}>
              <NavLink to="/user/profile">
                <i className="fas fa-user" />
                <span>Hồ sơ</span>
              </NavLink>
            </li>
            <li className={path === "/user/form-register" ? "active" : ""}>
              <NavLink to="/user/form-register">
                <i className="fas fa-clipboard" />
                <span>Đăng ký dịch vụ</span>
              </NavLink>
            </li>
            <li className={path === "/user/chat" ? "active" : ""}>
              <NavLink to="/user/chat">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="fas fa-comments" /> Chat
                  </span>
                  <span className="text-warning">(23)</span>
                </div>
              </NavLink>
            </li>
            <li className={path === "/user/address" ? "active" : ""}>
              <NavLink to="/user/address">
                <i className="fas fa-map-marked-alt" />
                <span>Địa chỉ</span>
              </NavLink>
            </li>
            <li className={path === "/user/ordered" ? "active" : ""}>
              <NavLink to="/user/ordered">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="fas fa-cart-arrow-down" /> Quản lí đơn hàng
                  </span>
                  <span className="text-warning">
                    ({order.filter((o) => o.status === "Pending").length})
                  </span>
                </div>
              </NavLink>
            </li>
            {/* 🔥 Thẻ thanh toán - chỉ hiện nếu là thợ */}
            {user?.role === "Repairman" && (
              <>
                <li className={path === "/user/payment" ? "active" : ""}>
                  <NavLink to="/user/payment">
                    <i className="fas fa-credit-card" />
                    <span>Thanh toán</span>
                  </NavLink>
                </li>
                <li
                  className={
                    [
                      "/user/new-blog",
                      "/user/create-blog",
                      "/user/blog-pending",
                      "/user/blog-detail",
                      "/user/blog-posted",
                    ].some((p) => path === p)
                      ? "active"
                      : ""
                  }
                >
                  <NavLink to="/user/blog-pending">
                    <i className="fas fa-blog" />
                    <span>Quản lý bài viết</span>
                  </NavLink>
                </li>
              </>
            )}
            <li className={path === "/user/ratting" ? "active" : ""}>
              <NavLink to="/user/ratting">
                <i className="fas fa-star" />
                <span>Đánh giá đơn hàng</span>
              </NavLink>
            </li>

            <li className={path === "/user/setting-profile" ? "active" : ""}>
              <NavLink to="/user/setting-profile">
                <i className="fas fa-user-cog" />
                <span>Chỉnh sửa hồ sơ</span>
              </NavLink>
            </li>
            <li className={path === "/user/change-password" ? "active" : ""}>
              <NavLink to="/user/change-password">
                <i className="fas fa-lock" />
                <span>Đổi mật khẩu</span>
              </NavLink>
            </li>

            <li className={path === "/login" ? "active" : ""}>
              <a onClick={logout}>
                <i className="fas fa-sign-out-alt" />
                <span>Đăng xuất</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidebarCustomer;
