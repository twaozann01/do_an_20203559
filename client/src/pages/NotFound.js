import React from "react";
import { error } from "../assets/img/banner";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <div></div>
      <div>
        {/* Page Content */}
        <section className="error-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-md-12 text-center">
                <div className="error-info">
                  <div className="error-404-img">
                    <img
                      src={error}
                      className="img-fluid"
                      alt="error-404-image"
                    />
                    <div className="error-content error-404-content">
                      <h2>
                        Xin lỗi! Chúng tôi không tìm thấy trang bạn yêu cầu.
                      </h2>
                      <p>
                        Có thể trang đã bị xóa hoặc đổi địa chỉ. Bạn vui lòng
                        kiểm tra lại đường dẫn hoặc quay về trang chủ.
                      </p>
                      <Link
                        to="/"
                        className="btn btn-primary prime-btn"
                      >
                        Về Trang chủ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* /Page Content */}
      </div>
    </div>
  );
};

export default NotFound;
