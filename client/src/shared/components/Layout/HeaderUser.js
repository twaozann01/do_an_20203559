/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useRef, useState } from "react";
import { avt, logo } from "../../../assets/img/banner";
import { Link, useLocation } from "react-router-dom";
import { user_3 } from "../../../assets/img/user";
import { AuthContext } from "../../../contexts/AuthContext"; // ✅ Import AuthContext
import { getImage } from "../../utils/getImage";
import { getInfo } from "../../../services/Api";
import { CartContext } from "../../../contexts/CartContext";
import { formatPrice } from "../../utils";

const HeaderUser = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const id = userInfo?.id;
  const isLoggedIn = !!userInfo;

  const [user, setUser] = useState([]);

  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;
  const isDropdownActive = (paths) => paths.some((p) => pathname.startsWith(p));

  const [showCart, setShowCart] = useState(false);
  const [showNoti, setShowNoti] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const cartRef = useRef();
  const notiRef = useRef();
  const userRef = useRef();

  const { cartItems, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!cartRef.current?.contains(e.target)) setShowCart(false);
      if (!notiRef.current?.contains(e.target)) setShowNoti(false);
      if (!userRef.current?.contains(e.target)) setShowUser(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const res = await getInfo(id);
          setUser(res.data);
        } catch (error) {
          console.error("Lỗi khi gọi getInfo:", error);
        }
      }
    };
    fetchUser();
  }, [id]);
  return (
    <header className="header header-custom header-fixed header-one">
      <div className="container">
        <nav className="navbar navbar-expand-lg header-nav">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand logo">
              <img src={logo} className="img-fluid" alt="Logo" />
            </Link>
          </div>
          <div className="main-menu-wrapper">
            <ul className="main-nav">
              <li
                className={`has-submenu megamenu ${
                  isActive("/") ? "active" : ""
                }`}
              >
                <Link to="/">Trang chủ</Link>
              </li>
              <li
                className={`has-submenu ${
                  isActive("/services") ? "active" : ""
                }`}
              >
                <Link to="/services">Dịch vụ</Link>
              </li>
              <li
                className={`has-submenu ${
                  isDropdownActive(["/book-orders", "/find-orders"])
                    ? "active"
                    : ""
                }`}
              >
                <a href="#">
                  Đơn hàng{" "}
                  {(user?.role === "Repairman" || !isLoggedIn) && (
                    <i className="fas fa-chevron-down" />
                  )}
                </a>
                <ul className="submenu">
                  <li>
                    <Link to="/book-orders">Đặt lịch sửa chữa</Link>
                  </li>
                  {(user?.role === "Repairman" || !isLoggedIn) && (
                    <li>
                      <Link to="/find-orders">Tìm đơn hàng</Link>
                    </li>
                  )}
                </ul>
              </li>
              {(user?.role === "Repairman" || !isLoggedIn) && (
                <li
                  className={`has-submenu ${
                    isDropdownActive(["/user/create-blog", "/new-blog"])
                      ? "active"
                      : ""
                  }`}
                >
                  <a href="#">
                    Bài viết <i className="fas fa-chevron-down" />
                  </a>
                  <ul className="submenu">
                    <li>
                      <Link to="/user/create-blog">Tạo bài viết</Link>
                    </li>
                    <li>
                      <Link to="/new-blog">Bài viết mới</Link>
                    </li>
                  </ul>
                </li>
              )}
              <li
                className={`has-submenu ${
                  isActive("/support") ? "active" : ""
                }`}
              >
                <Link to="/support">Hỗ trợ</Link>
              </li>

              {!isLoggedIn && (
                <>
                  <li className="register-btn">
                    <Link to="/register" className="btn reg-btn">
                      <i className="feather-user" /> Đăng kí
                    </Link>
                  </li>
                  <li className="register-btn">
                    <Link to="/login" className="btn btn-primary log-btn">
                      <i className="feather-lock" /> Đăng nhập
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {isLoggedIn && (
            <ul className="nav header-navbar-rht">
              {/* Cart */}
              <li
                className="nav-item dropdown noti-nav view-cart-header me-3 position-relative"
                ref={cartRef}
              >
                <button
                  className="nav-link p-0 position-relative btn border-0 bg-transparent"
                  onClick={() => setShowCart(!showCart)}
                >
                  <i className="fa-solid fa-cart-shopping" />
                  <small className="unread-msg1">{cartItems.length}</small>
                </button>
                {showCart && (
                  <div
                    className="dropdown-menu notifications dropdown-menu-end show position-absolute"
                    style={{ top: "100%", right: 0 }}
                  >
                    <div className="shopping-cart">
                      <ul className="shopping-cart-items list-unstyled">
                        {cartItems.length === 0 ? (
                          <li className="text-center text-muted">
                            Chưa có đơn nào
                          </li>
                        ) : (
                          cartItems.slice(0, 3).map((item, i) => {
                            const orderTotal = item.orderDetails.reduce(
                              (sum, d) => sum + (d.minPrice || 0),
                              0
                            );
                            return (
                              <li key={i} className="clearfix">
                                <div
                                  className="close-icon"
                                  onClick={() => removeFromCart(i)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <i className="fa-solid fa-circle-xmark" />
                                </div>
                                
                                <Link to="/cart" className="item-name">
                                  {item.deviceName || "Không rõ"}
                                </Link>
                                <span className="item-price">
                                  {formatPrice(orderTotal)}
                                </span>
                              </li>
                            );
                          })
                        )}
                      </ul>

                      <div className="clinic-booking pt-3">
                        <Link className="apt-btn" to="/cart">
                          Xem tất cả
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Notifications */}
              <li
                className="nav-item dropdown noti-nav me-3 pe-0 position-relative"
                ref={notiRef}
              >
                <button
                  className="nav-link p-0 btn border-0 bg-transparent"
                  onClick={() => setShowNoti(!showNoti)}
                >
                  <i className="fa-solid fa-bell" />
                  <span className="badge">5</span>
                </button>
                {showNoti && (
                  <div
                    className="dropdown-menu notifications dropdown-menu-end show position-absolute"
                    style={{ top: "100%", right: 0 }}
                  >
                    <div className="topnav-dropdown-header">
                      <span className="notification-title">Thông báo</span>
                    </div>
                    <div className="noti-content">
                      <ul className="notification-list">
                        {[...Array(3)].map((_, i) => (
                          <li key={i} className="notification-message">
                            <Link to="#">
                              <div className="notify-block d-flex">
                                <span className="avatar">
                                  <img
                                    className="avatar-img"
                                    src={user_3}
                                    alt="Avatar"
                                  />
                                </span>
                                <div className="media-body">
                                  <h6>
                                    Travis Tremble{" "}
                                    <span className="notification-time">
                                      Vừa xong
                                    </span>
                                  </h6>
                                  <p className="noti-details">
                                    Gửi 210.000đ cho{" "}
                                    <span className="noti-title">Dr. Ruby</span>
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>

              {/* User */}
              <li
                className="nav-item dropdown has-arrow logged-item position-relative"
                ref={userRef}
              >
                <button
                  className="dropdown-toggle nav-link btn border-0 bg-transparent"
                  onClick={() => setShowUser(!showUser)}
                >
                  <span className="user-img">
                    <img
                      className="rounded-circle"
                      src={user?.avatar === null ? avt : getImage(user?.avatar)}
                      width={31}
                      alt={user?.fullName || "Avatar"}
                    />
                  </span>
                </button>
                {showUser && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute"
                    style={{ top: "100%", right: 0 }}
                  >
                    <div className="user-header">
                      <div className="avatar avatar-sm">
                        <img
                          src={
                            user?.avatar === null ? avt : getImage(user?.avatar)
                          }
                          alt={user?.fullName || "Avatar"}
                          className="avatar-img rounded-circle"
                        />
                      </div>
                      <div className="user-text">
                        <h6>{user?.fullName}</h6>
                        <p className="text-muted mb-0">
                          {user?.role === "Customer"
                            ? "Khách hàng"
                            : "Kỹ thuật viên"}
                        </p>
                      </div>
                    </div>
                    <Link to="/user" className="dropdown-item">
                      Bảng điều khiển
                    </Link>
                    <Link to="/user/profile" className="dropdown-item">
                      Hồ sơ
                    </Link>
                    <a onClick={logout} className="dropdown-item">
                      Đăng xuất
                    </a>
                  </div>
                )}
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default HeaderUser;
