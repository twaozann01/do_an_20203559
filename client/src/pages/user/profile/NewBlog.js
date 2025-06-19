/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { repair_1, repair_2, repair_3, repair_4, repair_5, repair_6 } from "../../../assets/img/blog";
import { user_1, user_2, user_3 } from "../../../assets/img/user";
import { Link } from "react-router-dom";

const NewBlog = () => {
  return (
    <div>
      <div>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12">
                <div className="row blog-grid-row">
                  <div className="col-md-6 col-sm-12">
                    <div className="blog grid-blog">
                      <div className="blog-image">
                        <Link to='/blog-detail'>
                          <img className="img-fluid" src={repair_1} alt="Sửa điều hòa" />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <ul className="entry-meta meta-item">
                          <li>
                            <div className="post-author">
                              <a href="#">
                                <img src={user_1} alt="KTV" /> <span>KTV Nguyễn Văn Thợ</span>
                              </a>
                            </div>
                          </li>
                          <li>
                            <i className="far fa-clock" /> 04/12/2023
                          </li>
                        </ul>
                        <h3 className="blog-title">
                          <Link to='/blog-detail'>Cách sửa điều hòa không mát hiệu quả</Link>
                        </h3>
                        <p className="mb-0">Hướng dẫn từng bước kiểm tra và khắc phục lỗi điều hòa không mát.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="blog grid-blog">
                      <div className="blog-image">
                        <Link to='/blog-detail'>
                          <img className="img-fluid" src={repair_2} alt="Sửa máy giặt" />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <ul className="entry-meta meta-item">
                          <li>
                            <div className="post-author">
                              <a href="#">
                                <img src={user_2} alt="KTV" /> <span>KTV Trần Văn Kỹ</span>
                              </a>
                            </div>
                          </li>
                          <li>
                            <i className="far fa-clock" /> 03/12/2023
                          </li>
                        </ul>
                        <h3 className="blog-title">
                          <Link to='/blog-detail'>Các lỗi thường gặp ở máy giặt và cách khắc phục</Link>
                        </h3>
                        <p className="mb-0">Tổng hợp các lỗi phổ biến ở máy giặt và mẹo xử lý đơn giản.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="blog grid-blog">
                      <div className="blog-image">
                        <Link to='/blog-detail'>
                          <img className="img-fluid" src={repair_3} alt="Bảo trì tủ lạnh" />
                        </Link>
                      </div>
                      <div className="blog-content">
                        <ul className="entry-meta meta-item">
                          <li>
                            <div className="post-author">
                              <a href="#">
                                <img src={user_3} alt="KTV" /> <span>KTV Lê Thị Điện</span>
                              </a>
                            </div>
                          </li>
                          <li>
                            <i className="far fa-clock" /> 02/12/2023
                          </li>
                        </ul>
                        <h3 className="blog-title">
                          <Link to='/blog-detail'>Mẹo bảo trì tủ lạnh tiết kiệm điện</Link>
                        </h3>
                        <p className="mb-0">Cách vệ sinh, kiểm tra định kỳ giúp tăng tuổi thọ và tiết kiệm điện cho tủ lạnh.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12">
                    <div className="blog-pagination">
                      <nav>
                        <ul className="pagination justify-content-center">
                          <li className="page-item disabled">
                            <a className="page-link" href="#" tabIndex={-1}>
                              <i className="fas fa-angle-double-left" />
                            </a>
                          </li>
                          <li className="page-item active">
                            <a className="page-link" href="#">1</a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#">2</a>
                          </li>
                          <li className="page-item">
                            <a className="page-link" href="#">
                              <i className="fas fa-angle-double-right" />
                            </a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 sidebar-right theiaStickySidebar">
                <div className="card search-widget">
                  <div className="card-body">
                    <form className="search-form">
                      <div className="input-group">
                        <input type="text" placeholder="Tìm kiếm..." className="form-control" />
                        <button type="submit" className="btn btn-primary">
                          <i className="fa fa-search" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card post-widget">
                  <div className="card-header">
                    <h4 className="card-title">Bài viết mới</h4>
                  </div>
                  <div className="card-body">
                    <ul className="latest-posts">
                      <li>
                        <div className="post-thumb">
                          <Link to='/blog-detail'>
                            <img className="img-fluid" src={repair_4} alt="blog-image" />
                          </Link>
                        </div>
                        <div className="post-info">
                          <h4>
                            <Link to='/blog-detail'>Cách sửa điều hòa không mát hiệu quả</Link>
                          </h4>
                          <p>04/12/2023</p>
                        </div>
                      </li>
                      <li>
                        <div className="post-thumb">
                          <Link to='/blog-detail'>
                            <img className="img-fluid" src={repair_5} alt="blog-image" />
                          </Link>
                        </div>
                        <div className="post-info">
                          <h4>
                            <Link to='/blog-detail'>Các lỗi thường gặp ở máy giặt và cách khắc phục</Link>
                          </h4>
                          <p>03/12/2023</p>
                        </div>
                      </li>
                      <li>
                        <div className="post-thumb">
                          <Link to='/blog-detail'>
                            <img className="img-fluid" src={repair_6} alt="blog-image" />
                          </Link>
                        </div>
                        <div className="post-info">
                          <h4>
                            <Link to='/blog-detail'>Mẹo bảo trì tủ lạnh tiết kiệm điện</Link>
                          </h4>
                          <p>02/12/2023</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Sidebar */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBlog;
