/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import {  repair_2, repair_3, repair_4 } from "../../../assets/img/blog";
import { user_1, user_2 } from "../../../assets/img/user";

const BlogPending = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Cách sửa điều hòa không mát hiệu quả",
      image: repair_3,
      author: "KTV Nguyễn Văn Thợ",
      authorImg: user_1,
      date: "04/10/2023",
    },
    {
      id: 2,
      title: "Những lỗi thường gặp ở máy giặt và cách khắc phục",
      image: repair_4,
      author: "KTV Trần Văn Kỹ",
      authorImg: "../assets/img/doctors/doctor-thumb-02.jpg",
      date: "03/10/2023",
    },
    {
      id: 3,
      title: "Mẹo bảo trì tủ lạnh giúp tiết kiệm điện",
      image: repair_2,
      author: "KTV Lê Thị Điện",
      authorImg: user_2,
      date: "03/10/2023",
    },
  ];

  return (
    <div>
      {/* Thông tin cơ bản */}
      <div className="card">
        <div className="card-body">
          <div className="doc-review review-listing custom-edit-service">
            <div className="row mb-5">
              <div className="col">
                <ul className="nav nav-tabs nav-tabs-solid">
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/blog-posted">
                      Bài viết đã gửi
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link active" to="/user/blog-pending">
                      Đang chờ xử lý
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-auto">
                <Link className="btn btn-primary btn-sm" to="/user/create-blog">
                  <i className="fas fa-plus me-1" />
                  Thêm bài viết
                </Link>
              </div>
            </div>
          </div>

          <div className="row blog-grid-row">
            {blogPosts.map((post) => (
              <div key={post.id} className="col-md-6 col-xl-4 col-sm-12">
                <div className="blog grid-blog">
                  <div className="blog-image">
                    <Link to="user/blog-detail">
                      <img
                        className="img-fluid"
                        src={post.image}
                        alt="Hình ảnh bài viết"
                      />
                    </Link>
                  </div>
                  <div className="blog-content">
                    <ul className="entry-meta meta-item">
                      <li>
                        <div className="post-author">
                          <a href="./profile_technician.html">
                            <img src={post.authorImg} alt="Ảnh tác giả" />{" "}
                            <span>{post.author}</span>
                          </a>
                        </div>
                      </li>
                      <li>
                        <i className="far fa-clock" /> {post.date}
                      </li>
                    </ul>
                    <h3 className="blog-title">
                      <a href="./blog_detail.html">{post.title}</a>
                    </h3>
                    <p className="mb-0">
                      Đây là mô tả ngắn về nội dung bài viết liên quan đến sửa
                      chữa. Bạn có thể chỉnh sửa hoặc cập nhật chi tiết sau.
                    </p>
                  </div>
                  <div className="row pt-3">
                    <div className="col">
                      <Link to="*" className="text-success">
                        <i className="far fa-edit" /> Sửa
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phân trang */}
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
                    <i className="fas fa-angle-double-right" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPending;
