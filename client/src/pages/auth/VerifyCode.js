/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { forgot } from "../../assets/img/banner";
import { Link } from "react-router-dom";

const VerifyCode = () => {
  return (
    <div>
      {/* Page Content */}
      <div className="content">
        {/* Register */}
        <div className="container-auth">
          <div className="container">
            <div className="row">
              {/* Background  */}
              <div className="col-lg-7">
                <div className="background-container-auth">
                  <img src={forgot} alt className="img-fluid" />
                </div>
              </div>
              <div className="col-lg-5">
                <div className="login-container">
                  <h1>Tạo mật khẩu mới</h1>
                  <form>
                    <div className="form-group">
                      <label htmlFor="code">Mã code</label>
                      <input
                        type="text"
                        id="nameUser"
                        name="nameUser"
                        placeholder="Nhập mã gửi về điện thoại của bạn"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Mật khẩu mới</label>
                      <div className="password-container">
                        <input
                          type="password"
                          id="password_confirm"
                          name="confirm_password"
                          placeholder="Nhập lại mật khẩu"
                        />
                        <i
                          className="fas fa-eye password-toggle"
                          id="toggleConfirmPassword"
                          onclick="togglePasswordVisibility('password_confirm', 'toggleConfirmPassword')"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Xác nhận mật khẩu mới</label>
                      <div className="password-container">
                        <input
                          type="password"
                          id="password_confirm"
                          name="confirm_password"
                          placeholder="Nhập lại mật khẩu"
                        />
                        <i
                          className="fas fa-eye password-toggle"
                          id="toggleConfirmPassword"
                          onclick="togglePasswordVisibility('password_confirm', 'toggleConfirmPassword')"
                        />
                      </div>
                    </div>
                    <button type="submit">Đổi mật khẩu</button>
                  </form>
                  <div className="signup-link">
                    Bạn không nhận được mã?{" "}
                    <Link to="/forgot-password">Kiểm tra</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Register */}
      </div>
      {/* /Page Content */}
    </div>
  );
};

export default VerifyCode;
