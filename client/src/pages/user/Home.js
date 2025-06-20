/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React from "react";
import {
  banner_1,
  banner_2,
  banner_3,
  banner_4,
  checkup,
  content_1,
  content_2,
  content_3,
  content_4,
  down_arrow,
  faq,
  icon,
  logo_repair,
  technician,
  user,
} from "../../assets/img/banner";
import { dien_lanh, dien_nuoc, dien_tu } from "../../assets/img/logo_service";
import { tec_1, tec_2, tec_3 } from "../../assets/img/technician";
import { repair, repair_1, repair_2, repair_3 } from "../../assets/img/blog";

const Home = () => {
  return (
    <div>
      <div>
        {/* Home Banner */}
        <section className="banner-section">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="banner-content">
                  <h1>
                    Tìm kiếm <span>thợ giỏi nhất</span> gần vị trí của bạn.
                  </h1>
                  <img
                    src={logo_repair}
                    className="header-icon"
                    alt="header-icon"
                  />
                  <p>Tìm thợ nhanh chóng, trình độ chuyên môn cao.</p>
                  <a href="./book_orders.html" className="btn">
                    Bắt đầu tìm thợ
                  </a>
                  <div className="banner-arrow-img">
                    <img
                      src={down_arrow}
                      className="img-fluid"
                      alt="down-arrow"
                    />
                  </div>
                </div>
                <div className="search-box-one">
                  <form action="search-2.html">
                    <div className="search-input search-line">
                      <i className="feather-search bficon" />
                      <div className=" mb-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tìm thợ, dịch vụ sửa chữa"
                        />
                      </div>
                    </div>
                    <div className="search-input search-map-line">
                      <i className="feather-map-pin" />
                      <div className=" mb-0">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Vị trí của bạn"
                        />
                        <a
                          className="current-loc-icon current_location"
                        >
                          <i className="feather-crosshair" />
                        </a>
                      </div>
                    </div>
                    <div className="search-input search-calendar-line">
                      <i className="feather-calendar" />
                      <div className=" mb-0">
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder="Ngày giờ"
                        />
                      </div>
                    </div>
                    <div className="form-search-btn">
                      <button className="btn" type="submit">
                        Đặt lịch
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="banner-img">
                  <img
                    src={banner_1}
                    className="img-fluid"
                    alt="technician-image"
                  />
                  <div className="banner-img1">
                    <img
                      src={checkup}
                      className="img-fluid"
                      alt="checkup-image"
                    />
                  </div>
                  <div className="banner-img2">
                    <img
                      src={banner_2}
                      className="img-fluid"
                      alt="technician-slide"
                    />
                  </div>
                  <div className="banner-img3">
                    <img
                      src={banner_3}
                      className="img-fluid"
                      alt="users-list"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Home Banner */}


        {/* Service Section */}
        <section className="specialities-section-one">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="section-header-one section-header-slider">
                  <h2 className="section-title">Dịch vụ nổi bật</h2>
                </div>
              </div>
            </div>
            <div className="specialities-slider-one owl-theme">
              <div className="row">
                <div className="item col-lg-4">
                  <div className="specialities-item">
                    <div className="specialities-img">
                      <span>
                        <img src={dien_nuoc} alt="electricity-image" />
                      </span>
                    </div>
                    <p>Điện nước</p>
                  </div>
                </div>
                <div className="item col-lg-4">
                  <div className="specialities-item">
                    <div className="specialities-img">
                      <span>
                        <img src={dien_lanh} alt="refrigeration-image" />
                      </span>
                    </div>
                    <p>Điện lạnh</p>
                  </div>
                </div>
                <div className="item col-lg-4">
                  <div className="specialities-item">
                    <div className="specialities-img">
                      <span>
                        <img src={dien_tu} alt="electronics-image" />
                      </span>
                    </div>
                    <p>Điện tử</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="specialities-btn">
              <a href="./services.html" className="btn">
                Xem tất cả dịch vụ
              </a>
            </div>
          </div>
        </section>
        {/* /Service Section */}


        {/* Technician Section */}
        <section className="doctors-section">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="section-header-one section-header-slider">
                  <h2 className="section-title">Thợ kỹ thuật xuất sắc</h2>
                </div>
              </div>
            </div>
            <div className="doctor-slider-one owl-theme">
              <div className="row">
                {/* Technician Item */}
                <div className="item col-lg-4">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <a href="./profile_technician.html">
                        <div className="doctor-profile-img">
                          <img
                            src={tec_1}
                            className="img-fluid"
                            alt="Ruby Perrin"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <a href="./profile_technician.html">Hoàng Văn Thợ</a>
                          <p>Điện nước</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.5
                            </span>{" "}
                            (35)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Hoàng Mai, Hà Nội
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Technician Item */}
                {/* Technician Item */}
                <div className="item col-lg-4">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <a href="./profile_technician.html">
                        <div className="doctor-profile-img">
                          <img
                            src={tec_2}
                            className="img-fluid"
                            alt="Darren Elder"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <a href="./profile_technician.html">Nguyễn Văn Thợ</a>
                          <p>Điện lạnh</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.0
                            </span>{" "}
                            (20)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Hoàn Kiếm, Hà Nội
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Technician Item */}
                {/* Technician Item */}
                <div className="item col-lg-4">
                  <div className="doctor-profile-widget">
                    <div className="doc-pro-img">
                      <a href="./profile_technician.html">
                        <div className="doctor-profile-img">
                          <img
                            src={tec_3}
                            className="img-fluid"
                            alt="Sofia Brient"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="doc-content">
                      <div className="doc-pro-info">
                        <div className="doc-pro-name">
                          <a href="./profile_technician.html">Đồng Văn Thợ</a>
                          <p>Điện tử</p>
                        </div>
                        <div className="reviews-ratings">
                          <p>
                            <span>
                              <i className="fas fa-star" /> 4.5
                            </span>{" "}
                            (30)
                          </p>
                        </div>
                      </div>
                      <div className="doc-pro-location">
                        <p>
                          <i className="feather-map-pin" /> Thủ Đức, Hồ Chí Minh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Technician Item */}
              </div>
            </div>
          </div>
        </section>
        {/* /Technician Section */}


        {/* Option */}
        <section className="pricing-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="section-header-one">
                  <h2 className="section-title">
                    Chức năng của Người dùng &amp; Thợ
                  </h2>
                </div>
              </div>
            </div>
            <div className="row justify-content-center  align-items-center">
              <div className="col-lg-4 col-sm-12">
                <div className="card pricing-card">
                  <div className="card-body">
                    <div className="pricing-header">
                      <div className="pricing-header-info">
                        <div className="pricing-icon">
                          <span>
                            <img src={user} alt="icon" />
                          </span>
                        </div>
                        <div className="pricing-title">
                          <h4>Với Người dùng</h4>
                          <p>Cơ bản</p>
                        </div>
                      </div>
                      <div className="pricing-header-text">
                        <p>
                          Với tài khoản của người dùng cơ bản, những người có
                          nhu cầu sửa chữa tại nhà.
                        </p>
                      </div>
                    </div>
                    <div className="pricing-info">
                      <div className="pricing-amount">
                        <h6>Bao gồm các chức năng</h6>
                      </div>
                      <div className="pricing-list">
                        <ul>
                          <li>Đăng ki và đăng nhập tài khoản.</li>
                          <li>Xem và cập nhật thông tin cá nhân. </li>
                          <li>Xem và quản lí địa chỉ.</li>
                          <li>Tìm kiếm và xem hồ sợ của thợ.</li>
                          <li>Đặt và hủy đơn hàng. </li>
                          <li>Xem lịch sử đặt đơn và quản lí đơn hàng. </li>
                          <li>Đánh giá và nhận xét về dịch vụ.</li>
                          <li>Nhận thông báo cập nhật về đơn hàng.</li>
                        </ul>
                      </div>
                      <div className="pricing-btn">
                        <a className="btn" href="./register.html">
                          Đăng kí ngay
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="card pricing-card">
                  <div className="card-body">
                    <div className="pricing-header">
                      <div className="pricing-header-info">
                        <div className="pricing-icon">
                          <span>
                            <img src={technician} alt="icon" />
                          </span>
                        </div>
                        <div className="pricing-title">
                          <h4>Với Thợ sửa chữa </h4>
                          <p>Chuyên nghiệp</p>
                        </div>
                      </div>
                      <div className="pricing-header-text">
                        <p>
                          Với tài khoản của thợ, những người có nhu cầu tìm kiếm
                          việc làm.
                        </p>
                      </div>
                    </div>
                    <div className="pricing-info">
                      <div className="pricing-amount">
                        <h6>Bao gồm các chức năng</h6>
                      </div>
                      <div className="pricing-list">
                        <ul>
                          <li>Gồm các chức năng của người dùng.</li>
                          <li>Cập nhật danh mục sửa chữa.</li>
                          <li>Xem danh sách đơn hàng được giao</li>
                          <li>Chấp nhận hoặc từ chối đơn hàng.</li>
                          <li>Quản lí lịch làm việc một cách dễ dàng.</li>
                          <li>Xem báo cáo thu nhập cá nhân.</li>
                          <li>Xem đánh giá và nhận xét.</li>
                          <li>Xem bảng xếp hạng thợ.</li>
                        </ul>
                      </div>
                      <div className="pricing-btn">
                        <a className="btn" href="./register.html">
                          Đăng kí ngay
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Option */}


        {/* Work Section */}
        <section className="work-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12 work-img-info">
                <div className="work-img">
                  <img src={banner_4} className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-8 col-md-12 work-details">
                <div className="section-header-one">
                  <h5>Vì sao lựa chọn dịch vụ của chúng tôi?</h5>
                  <h2 className="section-title">
                    Quy trình vận hành đơn giản và hiệu quả
                  </h2>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="work-info">
                      <div className="work-icon">
                        <span>
                          <img src={content_2} />
                        </span>
                      </div>
                      <div className="work-content">
                        <h5>Tìm thợ nhanh chóng và dễ dàng</h5>
                        <p>
                          Chỉ vài thao tác đơn giản, bạn có thể tìm được thợ sửa
                          chữa phù hợp ngay gần khu vực của mình. Tiết kiệm thời
                          gian, không cần tìm kiếm thủ công.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="work-info">
                      <div className="work-icon">
                        <span>
                          <img src={content_3}  />
                        </span>
                      </div>
                      <div className="work-content">
                        <h5>Đảm bảo chất lượng dịch vụ</h5>
                        <p>
                          Chúng tôi cam kết mang đến dịch vụ chất lượng cao với
                          đội ngũ thợ chuyên nghiệp và đáng tin cậy. Đảm bảo
                          hoàn thành công việc đúng thời hạn.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="work-info">
                      <div className="work-icon">
                        <span>
                          <img src={content_1} />
                        </span>
                      </div>
                      <div className="work-content">
                        <h5>Hỗ trợ 24/7 và thông báo tức thời</h5>
                        <p>
                          Luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào, với hệ thống
                          thông bóng giúp bạn không bỏ lỡ thông tin quan trọng
                          nào. Đảm bảo liên lạc liền mạch giữa khách hàng và
                          thợ.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="work-info">
                      <div className="work-icon">
                        <span>
                          <img src={content_4}  />
                        </span>
                      </div>
                      <div className="work-content">
                        <h5>Đội ngũ thợ đa dạng, phủ sóng toàn quốc</h5>
                        <p>
                          Chúng tôi có mạng lưới thợ sửa chữa rộng khắp, dễ dàng
                          tìm thơ ở các khu vực xa xôi, sẵn sàng phục vụ bạn ở
                          bất kì đâu.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Work Section */}

        {/* Articles Section */}
        <section className="articles-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-header-one text-center">
                  <h2 className="section-title">Bài viết mới</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="articles-grid w-100">
                  <div className="articles-info">
                    <div className="articles-left">
                      <a href="./blog_detail.html">
                        <div className="articles-img">
                          <img
                            src={repair}
                            className="img-fluid"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="articles-right">
                      <div className="articles-content">
                        <ul className="articles-list nav">
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user "
                              >
                                <g>
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx={12} cy={7} r={4} />
                                </g>
                              </svg>
                            </i>{" "}
                            Thế Anh
                          </li>
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-calendar "
                              >
                                <g>
                                  <rect
                                    x={3}
                                    y={4}
                                    width={18}
                                    height={18}
                                    rx={2}
                                    ry={2}
                                  ></rect>
                                  <line x1={16} y1={2} x2={16} y2={6} />
                                  <line x1={8} y1={2} x2={8} y2={6} />
                                  <line x1={3} y1={10} x2={21} y2={10} />
                                </g>
                              </svg>
                            </i>{" "}
                            15/9/2024
                          </li>
                        </ul>
                        <h4>
                          <a href="./blog_detail.html">
                            Dịch vụ sửa chữa xe liệu có tốt không?
                          </a>
                        </h4>
                        <p>
                          Dịch vụ sửa xe của chúng tôi đảm bảo chất lượng vượt
                          trội với đội ngũ thợ lành nghề, sử dụng linh kiện
                          chính hãng để xe của bạn luôn vận hành an toàn và bền
                          bỉ.
                        </p>
                        <a className="btn" href="./blog_detail.html">
                          Xem bài viết
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="articles-grid w-100">
                  <div className="articles-info">
                    <div className="articles-left">
                      <a href="./blog_detail.html">
                        <div className="articles-img">
                          <img
                            src={repair_1}
                            className="img-fluid"                            
                          />
                        </div>
                      </a>
                    </div>
                    <div className="articles-right">
                      <div className="articles-content">
                        <ul className="articles-list nav">
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user "
                              >
                                <g>
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx={12} cy={7} r={4} />
                                </g>
                              </svg>
                            </i>{" "}
                            Hoàng Văn Thợ
                          </li>
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-calendar "
                              >
                                <g>
                                  <rect
                                    x={3}
                                    y={4}
                                    width={18}
                                    height={18}
                                    rx={2}
                                    ry={2}
                                  ></rect>
                                  <line x1={16} y1={2} x2={16} y2={6} />
                                  <line x1={8} y1={2} x2={8} y2={6} />
                                  <line x1={3} y1={10} x2={21} y2={10} />
                                </g>
                              </svg>
                            </i>{" "}
                            10/05/2025
                          </li>
                        </ul>
                        <h4>
                          <a href="./blog_detail.html">
                           5 lưu ý quan trọng khi sửa chữa điện tại nhà
                          </a>
                        </h4>
                        <p>
                          Việc tự sửa chữa thiết bị điện trong nhà có thể tiết kiệm chi phí, nhưng tiềm ẩn nhiều rủi ro. Bài viết này chia sẻ 5 lưu ý giúp bạn đảm bảo an toàn trong quá trình sửa chữa, từ việc ngắt nguồn điện, sử dụng thiết bị đúng cách, đến việc nhận biết các sự cố nguy hiểm cần gọi thợ chuyên nghiệp.
                        </p>
                        <a className="btn" href="./blog_detail.html">
                          Xem bài viết
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="articles-grid w-100">
                  <div className="articles-info">
                    <div className="articles-left">
                      <a href="./blog_detail.html">
                        <div className="articles-img">
                          <img
                            src={repair_2}
                            className="img-fluid"
                            
                          />
                        </div>
                      </a>
                    </div>
                    <div className="articles-right">
                      <div className="articles-content">
                        <ul className="articles-list nav">
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user "
                              >
                                <g>
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx={12} cy={7} r={4} />
                                </g>
                              </svg>
                            </i>{" "}
                            Nguyễn Thị Dịch Vụ
                          </li>
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-calendar "
                              >
                                <g>
                                  <rect
                                    x={3}
                                    y={4}
                                    width={18}
                                    height={18}
                                    rx={2}
                                    ry={2}
                                  ></rect>
                                  <line x1={16} y1={2} x2={16} y2={6} />
                                  <line x1={8} y1={2} x2={8} y2={6} />
                                  <line x1={3} y1={10} x2={21} y2={10} />
                                </g>
                              </svg>
                            </i>{" "}
                            15/05/2025
                          </li>
                        </ul>
                        <h4>
                          <a href="./blog_detail.html">
                            Bí quyết chọn thợ điện lạnh chất lượng mùa nắng nóng
                          </a>
                        </h4>
                        <p>
                         Khi mùa hè đến, nhu cầu sửa chữa máy lạnh tăng cao. Làm sao để chọn được thợ vừa giỏi, vừa uy tín, không bị “chặt chém”? Bài viết cung cấp những tiêu chí quan trọng như đánh giá từ khách hàng, chứng chỉ tay nghề, báo giá rõ ràng và phản hồi nhanh chóng.
                        </p>
                        <a className="btn" href="./blog_detail.html">
                          Xem bài viết
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 d-flex">
                <div className="articles-grid w-100">
                  <div className="articles-info">
                    <div className="articles-left">
                      <a href="./blog_detail.html">
                        <div className="articles-img">
                          <img
                            src={repair_3}
                            className="img-fluid"
                          />
                        </div>
                      </a>
                    </div>
                    <div className="articles-right">
                      <div className="articles-content">
                        <ul className="articles-list nav">
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-user "
                              >
                                <g>
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                  <circle cx={12} cy={7} r={4} />
                                </g>
                              </svg>
                            </i>{" "}
                            Cao Văn Sửa
                          </li>
                          <li>
                            <i>
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-calendar "
                              >
                                <g>
                                  <rect
                                    x={3}
                                    y={4}
                                    width={18}
                                    height={18}
                                    rx={2}
                                    ry={2}
                                  ></rect>
                                  <line x1={16} y1={2} x2={16} y2={6} />
                                  <line x1={8} y1={2} x2={8} y2={6} />
                                  <line x1={3} y1={10} x2={21} y2={10} />
                                </g>
                              </svg>
                            </i>{" "}
                            20/05/2025
                          </li>
                        </ul>
                        <h4>
                          <a href="./blog_detail.html">
                            Hướng dẫn xử lý rò rỉ nước đơn giản mà hiệu quả
                          </a>
                        </h4>
                        <p>
                          Rò rỉ nước tuy nhỏ nhưng có thể gây tốn kém và hư hại lâu dài cho ngôi nhà. Bài viết chia sẻ cách phát hiện rò rỉ, sử dụng keo chống thấm đúng cách và cách khóa van nước khẩn cấp. Ngoài ra, cũng khuyên bạn khi nào nên liên hệ thợ sửa chữa để đảm bảo an toàn và hiệu quả.
                        </p>
                        <a className="btn" href="./blog_detail.html">
                          Xem bài viết
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Articles Section */}

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-header-one text-center">
                  <h5>Giải đáp thắc mắc</h5>
                  <h2 className="section-title">Câu hỏi thường gặp</h2>
                </div>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="faq-img">
                  <img
                    src={faq}
                    className="img-fluid"
                    alt="img"
                  />
                  <div className="faq-patients-count">
                    <div className="faq-smile-img">
                      <img src={icon} alt="icon" />
                    </div>
                    <div className="faq-patients-content">
                      <h4>
                        <span className="count-digit">
                          <span>95</span>
                        </span>
                        k+
                      </h4>
                      <p>Phản hồi tốt từ khách hàng</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="faq-info">
                  <div className="accordion" id="faq-details">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <a
                          className="accordion-button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                          href="./NotFound.html"
                        >
                          Dịch vụ sửa chữa tại nhà của bạn bao gồm những hạng
                          mục nào?
                        </a>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#faq-details"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>
                              Chúng tôi cung cấp đa dạng dịch vụ: điện lạnh (sửa
                              điều hòa, tủ lạnh), điện dân dụng (sửa chập điện,
                              ổ cắm), nước (thông tắc cống, rò rỉ), thiết bị gia
                              đình (máy giặt, bếp từ).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <a
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                          aria-expanded="false"
                          aria-controls="collapseTwo"
                          href="./NotFound.html"
                        >
                          Làm sao để đặt lịch? Có thể đặt online không?
                        </a>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#faq-details"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>
                              Bạn có thể:
                              <br />
                              Đặt online qua website/app (chọn dịch vụ &gt; thời
                              gian &gt; thanh toán).
                              <br />
                              Gọi hotline 0123.456.789 (miễn phí).
                              <br />
                              Nhắn tin qua fanpage Facebook/Zalo.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <a
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                          aria-expanded="false"
                          aria-controls="collapseThree"
                          href="./NotFound.html"
                        >
                          Thời gian làm việc từ mấy giờ? Có hỗ trợ cuối tuần
                          không?
                        </a>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingThree"
                        data-bs-parent="#faq-details"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>
                              Làm việc 8h00 – 21h00 hàng ngày, kể cả thứ 7, Chủ
                              Nhật &amp; ngày lễ.
                              <br />
                              Hỗ trợ khẩn cấp 24/7 (phụ thu 20%).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <a
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                          aria-expanded="false"
                          aria-controls="collapseFour"
                          href="./NotFound.html"
                        >
                          Nhân viên kỹ thuật có chuyên nghiệp không?
                        </a>
                      </h2>
                      <div
                        id="collapseFour"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFour"
                        data-bs-parent="#faq-details"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>
                              Kỹ thuật viên có chứng chỉ, kinh nghiệm 3+ năm.
                              <br />
                              Mang đầy đủ dụng cụ, bảo hộ, cam kết lịch sự, vệ
                              sinh sạch sẽ.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFive">
                        <a
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFive"
                          aria-expanded="false"
                          aria-controls="collapseFive"
                          href="./NotFound.html"
                        >
                          Giá dịch vụ có niêm yết không? Có phát sinh phụ phí?
                        </a>
                      </h2>
                      <div
                        id="collapseFive"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingFive"
                        data-bs-parent="#faq-details"
                      >
                        <div className="accordion-body">
                          <div className="accordion-content">
                            <p>
                              Báo giá trước khi sửa, cam kết không phát sinh nếu
                              không thỏa thuận.
                              <br />
                              Phí di chuyển miễn phí trong bán kính 5km.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /FAQ Section */}
      </div>
    </div>
  );
};

export default Home;
