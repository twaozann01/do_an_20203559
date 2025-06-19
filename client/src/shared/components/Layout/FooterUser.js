/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { footer_img, logo } from "../../../assets/img/banner";
import { Link } from "react-router-dom";
const FooterUser = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="footer footer-one">
        <div className="footer-top aos" data-aos="fade-up">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="row container-item">
                  <div className="col-lg-6 col-md-12">
                    <div className="footer-widget footer-about">
                      <div className="footer-logo">
                        <Link to="/">
                          <img src={logo} alt="logo" />
                        </Link>
                      </div>
                      <div className="footer-about-content">
                        <p>
                          Dịch vụ sửa chữa tận nơi chuyên nghiệp - Nhanh chóng,
                          uy tín, giá cả hợp lý, đảm bảo chất lượng với đội ngũ
                          kỹ thuật viên giàu kinh nghiệm!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="row container-item">
                      <div className="col-lg-6 col-md-6">
                        <div className="footer-widget footer-menu">
                          <h2 className="footer-title">Đối với khách hàng</h2>
                          <ul>
                            <li>
                              <Link to="/login">Đăng nhập</Link>
                            </li>
                            <li>
                              <Link to="/register">Đăng kí</Link>
                            </li>
                            <li>
                              <Link to="/book-orders">Đặt lịch sửa chữa</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="footer-widget footer-menu">
                          <h2 className="footer-title">Đối với KTV</h2>
                          <ul>
                            <li>
                              <Link to="/login">Đăng nhập</Link>
                            </li>
                            <li>
                              <Link to="/find-orders">Quản lý đơn hàng</Link>
                            </li>
                            <li>
                              <Link to="/">Quản lý doanh thu</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="footer-widget footer-contact">
                      <h2 className="footer-title">Liên hệ với chúng tôi</h2>
                      <div className="footer-contact-info">
                        <div className="footer-address">
                          <p>
                            <i className="fas fa-map-marker-alt" />
                            Trương Định, Hoàng Mai, Hà Nội
                          </p>
                        </div>
                        <div className="footer-address">
                          <p>
                            <i className="fas fa-phone" />
                            +84 36 346 8723
                          </p>
                        </div>
                        <div className="footer-address mb-0">
                          <p>
                            <i className="fas fa-mail-bulk" />
                            son.hv203559@sis.hust.edu.vn
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="footer-widget">
                      <h2 className="footer-title">
                        Nhận thông báo của chúng tôi
                      </h2>
                      <div className="subscribe-form">
                        <form action="#">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Nhập địa chỉ email của bạn"
                          />
                          <Link to="/support" type="submit" className="btn">
                            Gửi
                          </Link>
                        </form>
                      </div>
                      <div className="social-icon">
                        <ul>
                          <li>
                            <a>
                              <i className="fab fa-facebook" />
                            </a>
                          </li>
                          <li>
                            <a>
                              <i className="fab fa-instagram" />
                            </a>
                          </li>
                          <li>
                            <a>
                              <i className="fab fa-twitter" />
                            </a>
                          </li>
                          <li>
                            <a>
                              <i className="fab fa-linkedin-in" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="footer-widget footer-scope">
                  <h2 className="footer-title">Phạm vi hoạt động</h2>
                  <div className="footer-scope-img">
                    <img
                      className="img-fluid"
                      src={footer_img}
                      alt="Scope-image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            {/* Copyright */}
            <div className="copyright">
              <div className="row ">
                <div className="col-md-6 col-lg-6">
                  <div className="copyright-text">
                    <p className="mb-0">
                      {" "}
                      Bản quyền © 2025{" "}
                      <a href="#" target="_blank">
                        ET4900.
                      </a>{" "}
                      Mọi quyền được bảo lưu.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6">
                  {/* Copyright Menu */}
                  <div className="copyright-menu">
                    <ul className="policy-menu">
                      <li>
                        <a href="privacy-policy.html">Chính sách bảo mật</a>
                      </li>
                      <li>
                        <a href="terms-condition.html">Điều khoản và Dịch vụ</a>
                      </li>
                    </ul>
                  </div>
                  {/* /Copyright Menu */}
                </div>
              </div>
            </div>
            {/* /Copyright */}
          </div>
        </div>
      </footer>
      {/* /Footer */}
    </div>
  );
};

export default FooterUser;
