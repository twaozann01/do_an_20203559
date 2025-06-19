/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import { tec_1, tec_2, tec_3 } from "../../assets/img/technician";

const ServiceGrid = () => {
  return (
    <div>
      <div>
        {/* Page Content */}
        <div className="doctor-content content">
          <div className="container">
            {/* Doctor Search List */}
            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="filter-contents">
                      <div className="filter-header">
                        <h4 className="filter-title">Bộ lọc</h4>
                      </div>
                      <div className="filter-details">
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="" data-bs-toggle="collapse">
                              Giới tính
                            </a>
                          </h4>
                          <div id="collapseone" className="collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="gender" />
                                    <span className="checkmark" />
                                    Nam
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="gender" />
                                    <span className="checkmark" />
                                    Nữ
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="#collapsetwo" data-bs-toggle="collapse">
                              Dịch vụ có sẵn
                            </a>
                          </h4>
                          <div id="collapsetwo" className="collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      name="availability"
                                    />
                                    <span className="checkmark" />
                                    Trong hôm nay
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      name="availability"
                                    />
                                    <span className="checkmark" />
                                    Trong ngày mai
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      name="availability"
                                    />
                                    <span className="checkmark" />
                                    Trong tuần này
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input
                                      type="checkbox"
                                      name="availability"
                                    />
                                    <span className="checkmark" />
                                    Trong tháng này
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="#servicedetail" data-bs-toggle="collapse">
                              Dịch vụ
                            </a>
                          </h4>
                          <div id="servicedetail" className="collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Điện tử
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Điện lạnh
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Điện nước
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Thời trang
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Nhà cửa
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    Nội thất
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="speciality" />
                                    <span className="checkmark" />
                                    ......
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="#collapsefive" data-bs-toggle="collapse">
                              Kinh nghiệm làm việc
                            </a>
                          </h4>
                          <div id="collapsefive" className=" collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="experience" />
                                    <span className="checkmark" />
                                    Dưới 1 Năm
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="experience" />
                                    <span className="checkmark" />
                                    1-3 Năm
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="experience" />
                                    <span className="checkmark" />
                                    3-5 Năm
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="experience" />
                                    <span className="checkmark" />
                                    Trên 5 Năm
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="#collapseseven" data-bs-toggle="collapse">
                              Đánh giá
                            </a>
                          </h4>
                          <div id="collapseseven" className="collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <div className="custom_check rating_custom_check d-inline-flex">
                                    <input type="checkbox" name="online" />
                                    <span className="checkmark" />
                                    <div className="rating">
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <span className="rating-count">(40)</span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom_check rating_custom_check d-inline-flex">
                                    <input type="checkbox" name="online" />
                                    <span className="checkmark" />
                                    <div className="rating">
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star" />
                                      <span className="rating-count">(35)</span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom_check rating_custom_check d-inline-flex">
                                    <input type="checkbox" name="online" />
                                    <span className="checkmark" />
                                    <div className="rating">
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <span className="rating-count">(20)</span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom_check rating_custom_check d-inline-flex">
                                    <input type="checkbox" name="online" />
                                    <span className="checkmark" />
                                    <div className="rating">
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <span className="rating-count">(10)</span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="custom_check rating_custom_check d-inline-flex">
                                    <input type="checkbox" name="online" />
                                    <span className="checkmark" />
                                    <div className="rating">
                                      <i className="fas fa-star filled" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <i className="fas fa-star" />
                                      <span className="rating-count">(05)</span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Grid */}
                        <div className="filter-grid">
                          <h4>
                            <a href="#collapseeight" data-bs-toggle="collapse">
                              Khu vực
                            </a>
                          </h4>
                          <div id="collapseeight" className="collapse show">
                            <div className="filter-collapse">
                              <ul>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="language" />
                                    <span className="checkmark" />
                                    Hà Nội
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="language" />
                                    <span className="checkmark" />
                                    Đà Nẵng
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="language" />
                                    <span className="checkmark" />
                                    Thành phố Hồ Chí Minh
                                  </label>
                                </li>
                                <li>
                                  <label className="custom_check d-inline-flex">
                                    <input type="checkbox" name="language" />
                                    <span className="checkmark" />
                                    Các tỉnh thành khác
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Grid */}
                        {/* Filter Btn */}
                        <div className="filter-btn apply-btn">
                          <div className="row">
                            <div className="col-6">
                              <a
                                className="btn btn-primary"
                              >
                                Áp dụng
                              </a>
                            </div>
                            <div className="col-6">
                              <a
                                className="btn btn-outline-primary"
                              >
                                Đặt lại
                              </a>
                            </div>
                          </div>
                        </div>
                        {/* /Filter Btn */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <div className="doctor-filter-info">
                      <div className="doctor-filter-inner">
                        <div>
                          <div className="doctors-found">
                            <p>
                              <span>100 Kỹ thuật viên ở</span> gần khu vực của
                              bạn!
                            </p>
                          </div>
                          <div className="doctor-filter-availability">
                            <p>Sẵn sàng</p>
                            <div className="status-toggle status-tog">
                              <input
                                type="checkbox"
                                id="status_6"
                                className="check"
                              />
                              <label htmlFor="status_6" className="checktoggle">
                                checkbox
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="doctor-filter-option">
                          <div className="doctor-filter-sort">
                            <p>Sắp xếp</p>
                            <div className="doctor-filter-select">
                              <select className="select">
                                <option>A -&gt; Z</option>
                                <option>B -&gt; Z</option>
                                <option>C -&gt; Z</option>
                                <option>D -&gt; Z</option>
                                <option>E -&gt; Z</option>
                              </select>
                            </div>
                          </div>

                          <div className="doctor-filter-sort">
                            <ul className="nav">
                              <li>
                                <Link to="/services-grid" className="active">
                                  <i className="fas fa-th-large" />
                                </Link>
                              </li>
                              <li>
                                <Link to="/services">
                                  <i className="fas fa-list-ul" />
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_1}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_2}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_3}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_3}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_2}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_1}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-6 col-md-6">
                        <div className="doctor-profile-widget doc-grid">
                          <div className="doc-pro-img">
                            <a href="./profile_technician.html">
                              <div className="doctor-profile-img">
                                <img
                                  src={tec_1}
                                  className="img-fluid"
                                  alt="John Doe"
                                />
                              </div>
                            </a>
                            <div className="reviews-ratings">
                              <p>
                                <span>
                                  <i className="fas fa-star" /> 4.5
                                </span>
                              </p>
                            </div>
                            <div className="favourite-btn">
                              <a
                                className="favourite-icon"
                              >
                                <i className="fas fa-heart" />
                              </a>
                            </div>
                          </div>
                          <div className="doc-content">
                            <div className="doc-pro-info">
                              <div className="doc-pro-name">
                                <h4>
                                  <a href="doctor-profile.html">
                                    Hoàng Văn Thợ
                                  </a>
                                  <i className="fas fa-circle-check" />
                                </h4>
                                <p>Điện tử</p>
                              </div>
                            </div>
                            <div className="doc-pro-location">
                              <p className="doc-location">
                                <i className="fas fa-map-marker-alt" />
                                <span>0.9</span> km - Hoàng Mai, Hà Nội
                              </p>
                              <p className="doc-location">
                                <i className="fas fa-award" /> <span>20</span>{" "}
                                Năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        <div className="blog-pagination rev-page">
                          <nav>
                            <ul className="pagination justify-content-center">
                              <li className="page-item disabled">
                                <a
                                  className="page-link page-prev"
                                  href="#"
                                  tabIndex={-1}
                                >
                                  <i className="fas fa-chevron-left" />
                                </a>
                              </li>
                              <li className="page-item active">
                                <a className="page-link" href="#">
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  ...
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="#">
                                  10
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link page-next" href="#">
                                  <i className="fas fa-chevron-right" />
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Doctor Search List */}
          </div>
        </div>
        {/* /Page Content */}
      </div>
    </div>
  );
};

export default ServiceGrid;
